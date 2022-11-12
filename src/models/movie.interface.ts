import { IImage } from './image.interface';

export interface IMovie {
  _id: string;
  name: string;
  description: string;
  duration: string;
  rating: number;
  releaseDate: number;
  genres: Array<string>;
  path?: string;
}

export interface IMovieResponse {
  id: string;
  name: string;
  description: string;
  duration: string;
  rating: number;
  releaseDate: number;
  genres: Array<string>;
  posterPath?: string;
}

export interface IMovieResponseExtended extends IMovieResponse {
  imagesPaths?: Array<string>;
  actors?: [];
}

export interface IMovieRequestExtended extends IMovie {
  imagePaths?: Array<string>;
  posterPath?: string;
}

export interface IMovieImageAggregation extends IMovie {
  images?: Array<IImage>;
}

export interface IMovieFilter {
  name?: { $regex: string; $options: string };
  rating?: { $gte: number; $lte: number };
  releaseDate?: { $gte: number; $lte: number };
  genres?: { $in: Array<string> }
}

export interface IMovieFilterQuery {
  name?: string;
  ratingGte?: number;
  ratingLte?: number;
  releaseDateGte?: number;
  releaseDateLte?: number;
  genres?: Array<string>
}
