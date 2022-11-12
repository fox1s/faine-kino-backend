import { NextFunction, Request, Response } from 'express';
// import { movieQueryBuilder } from '../../helpers';
import { IMovieRequestExtended, IRequestExtended } from '../../models';
// import { logService, movieService } from '../../services';
import { ResponseStatusCodesEnum } from '../../constants';
import { imageService } from '../../services';
import { customErrors, ErrorHandler } from '../../errors';
import { Types } from 'mongoose';
// import { Types } from 'mongoose';
// import { customErrors, ErrorHandler } from '../../errors';

const fs = require('fs');
const path = require('path');

class ImageController {
  // async getPostersByMovieId(req: Request, res: Response, next: NextFunction) {
  //   try {

  //     // res.json('products');
  //   } catch (e) {
  //     next(e);
  //   }
  // }

  getImage(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(req.query);

      // const imagePaths = await imageService.findImagePathsByMovieId({
      //   movieId: req.params.movieId
      // });

      // TODO додати мідлварку чи існують всі квері
      let posterPath = '';
      try {
        posterPath = path.join(
          process.cwd(),
          `../imageDB/${req.params.movieId}/${req.query.name}`
        );
      } catch (e) {
        return next(
          new ErrorHandler(ResponseStatusCodesEnum.NOT_FOUND, 'not found', 4041)
        );
      }

      const stat = fs.statSync(posterPath);

      res.writeHead(200, {
        'Content-Type': 'image/*',
        'Content-Length': stat.size
      });

      const readStream = fs.createReadStream(posterPath);
      // We replaced all the event handlers with a simple call to readStream.pipe()
      readStream.pipe(res);
    } catch (e) {
      next(e);
    }
  }

  async getPoster(req: Request, res: Response, next: NextFunction) {
    try {
      const imagePaths = await imageService.findImagePathsByMovieId({
        movieId: new Types.ObjectId(req.params.movieId)
      });

      const posterPath = path.join(
        process.cwd(),
        `../imageDB/${req.params.movieId}/${imagePaths?.posterPath}`
      );
      const stat = fs.statSync(posterPath);

      res.writeHead(200, {
        'Content-Type': 'image/*',
        'Content-Length': stat.size
        // 'Cross-Origin-Resource-Policy': 'same-site'
        // "Cross-Origin-Resource-Policy": "cross-origin",
      });

      const readStream = fs.createReadStream(posterPath);
      // We replaced all the event handlers with a simple call to readStream.pipe()
      readStream.pipe(res);
    } catch (e) {
      next(e);
    }
  }

  async uploadPoster(req: IRequestExtended, res: Response, next: NextFunction) {
    const { _id: movieId, posterPath } = req.movie as IMovieRequestExtended;
    const { modifiedCount: isImagesPathsUpdated } =

      await imageService.updateImagesPaths(
        { movieId: new Types.ObjectId(movieId) },
        { posterPath }
      );

    if (!isImagesPathsUpdated) {
      return next(
        new ErrorHandler(
          ResponseStatusCodesEnum.INTERNAL_SERVER_ERROR,
          customErrors.INTERNAL_SERVER_ERROR_DATA_NOT_UPDATED.message,
          customErrors.INTERNAL_SERVER_ERROR_DATA_NOT_UPDATED.code
        )
      );
    }

    res.status(ResponseStatusCodesEnum.CREATED).json({ status: 'Data saved' });
  }

  async uploadImages(req: IRequestExtended, res: Response, next: NextFunction) {
    // якшо нема такого запису з movieId то кинути ерору
    const { modifiedCount: isImagesPathsUpdated } =
      await imageService.updateImagesPaths(
        { movieId: new Types.ObjectId(req.movie?._id) },
        { imagesPath: req.movie?.imagePaths }
      );

    if (!isImagesPathsUpdated) {
      return next(
        new ErrorHandler(
          ResponseStatusCodesEnum.INTERNAL_SERVER_ERROR,
          customErrors.INTERNAL_SERVER_ERROR_DATA_NOT_UPDATED.message,
          customErrors.INTERNAL_SERVER_ERROR_DATA_NOT_UPDATED.code
        )
      );
    }

    res.status(ResponseStatusCodesEnum.CREATED).json({ status: 'Data saved' });
  }
}

export const imageController = new ImageController();
