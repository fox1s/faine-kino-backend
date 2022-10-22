import { NextFunction, Request, Response } from 'express';
import * as fs from 'fs';
import { ResponseStatusCodesEnum } from '../../constants';
import { customErrors, ErrorHandler } from '../../errors';
import { movieService } from '../../services';
// import {Types, Error} from "mongoose"
import { config } from '../../config';

class VideoStreamController {
  async sendVideo(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    console.log(req.params, id);
    // TODO якщо прислати криве айді - ерора. тому нижче додав трай кетч
    let movie;
    try {
      movie = await movieService.findOneByParams({ _id: id });
    } catch (err: any) {
      if (err.message.includes('Cast to ObjectId failed')) {
        return next(
          new ErrorHandler(
            ResponseStatusCodesEnum.BAD_REQUEST,
            customErrors.BAD_REQUEST_MOVIE_ID_NOT_CORRECT.message,
            customErrors.BAD_REQUEST_MOVIE_ID_NOT_CORRECT.code
          )
        );
      }
    }

    if (!movie) {
      return next(
        new ErrorHandler(
          ResponseStatusCodesEnum.NOT_FOUND,
          customErrors.MOVIE_NOT_FOUND.message,
          customErrors.MOVIE_NOT_FOUND.code
        )
      );
    }

    const range = req.headers.range;
    if (!range) {
      res.status(400).send('Requires Range header');
    }
    const videoPath = `${config.MOVIES_DB_FOLDER_PATH}/${movie.path}`;
    console.log(videoPath);
    const videoSize = fs.statSync(videoPath).size;
    const CHUNK_SIZE = 10 ** 6; // 1MB
    const start = Number(range?.replace(/\D/g, ''));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

    const contentLength = end - start + 1;
    const headers = {
      'Content-Range': `bytes ${start}-${end}/${videoSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': contentLength,
      'Content-Type': 'video/mp4',
      'Cross-Origin-Resource-Policy': 'same-site'
      // "Access-Control-Allow-Origin": "*",
    };

    // HTTP Status 206 for Partial Content
    res.writeHead(206, headers);

    // create video read stream for this particular chunk
    const videoStream = fs.createReadStream(videoPath, { start, end });

    // Stream the video chunk to the client
    videoStream.pipe(res);
  }
}

export const videoStreamController = new VideoStreamController();
