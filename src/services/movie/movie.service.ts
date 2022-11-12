// import { Types } from 'mongoose';

// import { Types } from "mongoose";
import { MovieModel } from '../../database';
import { IMovie, IMovieFilter, IMovieImageAggregation } from '../../models';

class MovieService {
  createMovie(movie: Partial<IMovie>): Promise<IMovie> {
    const movieToCreate = new MovieModel(movie);

    return movieToCreate.save();
  }

  findMovies(
    filterQuery: Partial<IMovieFilter>,
    limit: number,
    page: number
  ): Promise<IMovieImageAggregation[] | []> {
    const skip = limit * (page - 1);

    return MovieModel.aggregate([
      { $match: filterQuery },
      {
        $lookup: {
          from: 'images',
          localField: '_id',
          foreignField: 'movieId',
          as: 'images'
        }
      },
      // {
      //   $unwind: '$images'
      // },
      // {
      //   $project: {
      //     __v: 0,
      //     // "images.__v": 0,
      //     // 'images._id': 0,
      //     'images.posterPath': 0
      //     // "images.mob": 0,
      //   }
      // },
      { $skip: skip }
    ])
      .limit(limit)
      // .skip(skip)
      // .lean()
      .exec();

    // return MovieModel.find(filterQuery)
    //   .limit(limit)
    //   .skip(skip)
    //   .lean()
    //   .exec();
  }

  updateUserByParams(params: Partial<IMovie>, update: Partial<IMovie>) {
    return MovieModel.updateOne(params, update, { new: true }).exec();
  }

  findOneByParams(findObject: Partial<IMovie>): Promise<IMovie | null> {
    return MovieModel.findOne(findObject).exec();
  }
}

export const movieService = new MovieService();
