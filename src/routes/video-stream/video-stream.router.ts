import { Router } from "express";
import * as fs from "fs";

// import { userController } from '../../controllers';

const router = Router();

router.get(
  "/",
  // TODO middlewares
  (req, res) => {
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
  }
);

export const videoStreamRouter = router;
