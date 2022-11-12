import { NextFunction, Request, Response } from 'express';
import * as fs from 'node:fs/promises';

import { movieQueryBuilder } from '../../helpers';
import { IMovie, IMovieFilterQuery, IRequestExtended } from '../../models';
import { imageService, logService, movieService } from '../../services';
import { LogEnum, ResponseStatusCodesEnum } from '../../constants';
import { customErrors, ErrorHandler } from '../../errors';
import { Types } from 'mongoose';
import { mapIMovieToIMovieResponse } from '../../helpers/mappers/movie';
import { mapIMovieToIMovieResponseExtended } from '../../helpers';

class MovieController {
  async createMovie(req: IRequestExtended, res: Response, next: NextFunction) {
    try {
      // const {_id} = req.movie as IMovie;
      const movie = req.body as IMovie;
      console.log(movie);
      // movie.path = '';
      // const genres = ['Action','Comedy','Drama','Fantasy','Horror','Mystery','Romance','Thriller','Western'];
      // const rand = Math.floor(Math.random() * genres.length);
      // movie.genres = [genres[rand], genres[rand], genres[rand]]
      const newMovie = await movieService.createMovie(movie);

      try {
        await imageService.createImagesPaths({
          movieId: new Types.ObjectId(newMovie._id)
        });
        await fs.mkdir(('../imageDB/' + newMovie._id.toString()) as string);
      } catch (e) {
        console.log('ImagesPaths not created', e);
      }

      await logService.createLog({
        // Todo add middleware with const {_id} = req.movie as IMovie;
        userId: '_id',
        event: LogEnum.MOVIE_CREATED,
        data: {
          productId: newMovie._id,
          title: newMovie.name
        }
      });

      res.json(newMovie);
    } catch (e) {
      next(e);
    }
  }

  async getMovies(req: Request, res: Response, next: NextFunction) {
    try {
      // console.log('tyt');
      // TODO забрати any
      const { limit = 20, page = 1, ...filter } = req.query;

      // filter.genres = filter.genres ? filter.genres.split(',') : [];
      console.log(filter);
      // console.log('tyt');
      // console.log(filter);
      const filterQuery = movieQueryBuilder(
        filter as Partial<IMovieFilterQuery>
      );
      // console.log('tyt');
      console.log('filterQuery',filterQuery);
      const movies = await movieService.findMovies(filterQuery, +limit, +page);
      // const posterPath = await imageService.findImagePathsByMovieId(req.)
      // res.json(movies);
      console.log('tyt');
      console.log(movies);
      res.json({
        data: movies.map((movie) => mapIMovieToIMovieResponse(movie)),
        length: movies.length
      });
    } catch (e) {
      next(e);
    }
  }

  async getMovie(req: Request, res: Response, next: NextFunction) {
    const { movieId } = req.params;
    const movie = await movieService.findOneByParams({ _id: movieId });
    if (!movie) {
      return next(
        new ErrorHandler(
          ResponseStatusCodesEnum.NOT_FOUND,
          customErrors.MOVIE_NOT_FOUND.message,
          customErrors.MOVIE_NOT_FOUND.code
        )
      );
    }

    res.json({
      data: mapIMovieToIMovieResponseExtended(movie)
    });

  }

  async uploadMovie(req: IRequestExtended, res: Response, next: NextFunction) {
    const { modifiedCount: isMovieUpdated } =
      await movieService.updateUserByParams(
        { _id: req.movie?._id },
        { path: req.movie?.path }
      );

    if (!isMovieUpdated) {
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
    const { modifiedCount: isMovieUpdated } =
      await movieService.updateUserByParams(
        { _id: req.movie?._id },
        { path: req.movie?.path }
      );

    if (!isMovieUpdated) {
      return next(
        new ErrorHandler(
          ResponseStatusCodesEnum.INTERNAL_SERVER_ERROR,
          customErrors.INTERNAL_SERVER_ERROR_DATA_NOT_UPDATED.message,
          customErrors.INTERNAL_SERVER_ERROR_DATA_NOT_UPDATED.code
        )
      );
    }

    res.json({ status: 'Data saved' });
  }
}

export const movieController = new MovieController();
