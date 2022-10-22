import { NextFunction, Request, Response } from 'express';
import { movieQueryBuilder } from '../../helpers';
import { IMovieFilterQuery, IRequestExtended } from 'src/models';
import { logService, movieService } from '../../services';
import { LogEnum } from '../../constants';

class MovieController {
  async createMovie(req: IRequestExtended, res: Response, next: NextFunction) {
    try {
      // const {_id} = req.movie as IMovie;
      const movie = req.body;
      console.log(movie);
      movie.path = 'test-video-2.mp4';

      const newMovie = await movieService.createMovie(movie);

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
      const { limit = 20, page = 1, ...filter } = req.query;
      console.log(filter);
      // console.log(filter);
      const filterQuery = movieQueryBuilder(
        filter as Partial<IMovieFilterQuery>
      );
      console.log(filterQuery);
      const products = await movieService.findMovies(
        filterQuery,
        +limit,
        +page
      );

      res.json(products);
    } catch (e) {
      next(e);
    }
  }
}

export const movieController = new MovieController();
