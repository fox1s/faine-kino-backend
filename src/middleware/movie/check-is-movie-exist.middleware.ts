import { NextFunction, Response } from 'express';

import { movieService } from '../../services';
import { customErrors, ErrorHandler } from '../../errors';
import { ResponseStatusCodesEnum } from '../../constants';
import { IRequestExtended } from '../../models';

export const checkIsMovieExistByIdMiddleware = async (
  req: IRequestExtended,
  res: Response,
  next: NextFunction
): Promise<void | NextFunction> => {
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
  console.log(movie);
  req.movie = movie;
  next();
};
