import { Types } from 'mongoose';

export interface IImage {
  _id: string;
  movieId: Types.ObjectId;
  posterPath: string;
  imagesPath: Array<string>;
}

// export interface IMovieFilter {
//   name?: { $regex: string; $options: string };
//   rating?: { $gte: number; $lte: number };
//   releaseDate?: { $gte: number; $lte: number };
// }

// export interface IMovieFilterQuery {
//   name?: string;
//   ratingGte?: number;
//   ratingLte?: number;
//   releaseDateGte?: number;
//   releaseDateLte?: number;
// }
