// import { Types } from 'mongoose';

import { MovieModel } from '../../database';
import { IMovie, IMovieFilter } from '../../models';

class MovieService {
  createMovie(movie: Partial<IMovie>): Promise<IMovie> {
    const movieToCreate = new MovieModel(movie);

    return movieToCreate.save();
  }

  findMovies(
    filterQuery: Partial<IMovieFilter>,
    limit: number,
    page: number
  ): Promise<IMovie[] | []> {
    const skip = limit * (page - 1);

    return MovieModel.find(filterQuery).limit(limit).skip(skip).lean().exec();
  }

  // updateUserByParams(params: Partial<IUser>, update: Partial<IUser>) {
  //   return UserModel.updateOne(params, update, { new: true }).exec();
  // }

  findOneByParams(findObject: Partial<IMovie>): Promise<IMovie | null> {
    return MovieModel.findOne(findObject).exec();
  }
}

export const movieService = new MovieService();
