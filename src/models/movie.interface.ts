export interface IMovie {
  _id: string;
  name: string;
  description: string;
  duration: string;
  rating: number;
  releaseDate: number;
  path?: string;
}

export interface IMovieFilter {
  name?: { $regex: string; $options: string };
  rating?: { $gte: number; $lte: number };
  releaseDate?: { $gte: number; $lte: number };
}

export interface IMovieFilterQuery {
  name?: string;
  ratingGte?: number;
  ratingLte?: number;
  releaseDateGte?: number;
  releaseDateLte?: number;
}
