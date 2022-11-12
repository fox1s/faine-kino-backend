import { IMovieImageAggregation, IMovieResponseExtended } from '../../../models';
import { mapIMovieToIMovieResponse } from './map-IMovie-to-IMovieResponse.mapper';

export const mapIMovieToIMovieResponseExtended = (
  movie: IMovieImageAggregation
): IMovieResponseExtended => {
  console.log(movie);

  return {
    ...mapIMovieToIMovieResponse(movie),
    imagesPaths: movie?.images?.length ? movie.images[0].imagesPath : [],
    actors: []
  };
};
