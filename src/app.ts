import * as cors from "cors";
// import * as expressFileUpload from 'express-fileupload';
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import * as dotenv from "dotenv";
import * as express from "express";
import { NextFunction, Request, Response } from "express";
import * as morgan from "morgan";
import * as mongoose from "mongoose";
import * as path from "path";
import * as fs from "fs";
// import * as swaggerUI from 'swagger-ui-express';

import { config } from "./config";
// import {adminRouter, authRouter, cartRouter, categoryRouter, productRouter, userRouter} from './routes';
import { ResponseStatusCodesEnum } from "./constants";
// import * as swaggerDoc from './docs/swagger.json';

dotenv.config();

const serverRequestLimit = rateLimit({
  windowMs: config.serverRateLimits.period,
  max: config.serverRateLimits.maxRequests,
});

class App {
  public readonly app: express.Application = express();

  constructor() {
    // https://www.anycodings.com/1questions/757624/declare-global-variable-in-seperate-file-nodejstypescript - fix '(global as any)'
    (global as any).appRoot = path.resolve(process.cwd(), "../");

    this.app.use(morgan("dev"));
    this.app.use(helmet());
    this.app.use(serverRequestLimit);
    // this.app.use(expressFileUpload());
    this.app.use(
      cors({
        origin: this.configureCors,
      })
    );

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    this.app.use(
      express.static(path.resolve((global as any).appRoot, "public"))
    );
    // this.app.use(express.static(path.join(process.cwd(), "../", "public")));

    this.mountRoutes();
    this.setupDB();

    this.app.use(this.customErrorHandler);
  }

  private setupDB(): void {
    mongoose.connect(config.MONGODB_URL);

    const db = mongoose.connection;
    db.on("error", console.log.bind(console, "MONGO ERRROR"));
  }

  private customErrorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    res.status(err.status || ResponseStatusCodesEnum.SERVER).json({
      message: err.message || "Unknown Error",
      code: err.code,
    });
  }

  private configureCors = (origin: any, callback: any) => {
    const whiteList = config.ALLOWED_ORIGIN.split(";");

    if (!origin) {
      // FOR POSTMAN
      return callback(null, true);
    }

    if (!whiteList.includes(origin)) {
      return callback(new Error("Cors not allowed"), false);
    }

    return callback(null, true);
  };

  private mountRoutes(): void {
    this.app.get("/test-video", (req, res) => {
      const range = req.headers.range;
      if (!range) {
        res.status(400).send("Requires Range header");
      }
      const videoPath = "test-video-2.mp4";
      const videoSize = fs.statSync(videoPath).size;
      const CHUNK_SIZE = 10 ** 6; // 1MB
      const start = Number(range?.replace(/\D/g, ""));
      const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

      const contentLength = end - start + 1;
      const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
        // "Access-Control-Allow-Origin": "*",
        "Cross-Origin-Resource-Policy": "same-site",
      };

      // HTTP Status 206 for Partial Content
      res.writeHead(206, headers);

      // create video read stream for this particular chunk
      const videoStream = fs.createReadStream(videoPath, { start, end });

      console.log("chunk");

      // Stream the video chunk to the client
      videoStream.pipe(res);
    });
    //   this.app.use("/admin", adminRouter);
    //   this.app.use("/auth", authRouter);
    //   this.app.use("/cart", cartRouter);
    //   this.app.use("/categories", categoryRouter);
    //   this.app.use("/products", productRouter);
    //   this.app.use("/users", userRouter);

    //   this.app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc));
  }
}

export const app = new App().app;
