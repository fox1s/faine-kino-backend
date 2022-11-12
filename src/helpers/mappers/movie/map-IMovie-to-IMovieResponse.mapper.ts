import { IMovieImageAggregation, IMovieResponse } from 'src/models';

export const mapIMovieToIMovieResponse = (
  movie: IMovieImageAggregation
): IMovieResponse => {
  console.log(movie);

  return {
    id: movie._id,
    name: movie.name,
    description: movie.description,
    duration: movie.duration,
    rating: movie.rating,
    releaseDate: movie.releaseDate,
    posterPath:  movie?.images?.length ? movie.images[0].posterPath : '',
    genres: movie.genres
  };
};
