import { IMovieFilter, IMovieFilterQuery } from '../../models';

export const movieQueryBuilder = (
  query: Partial<IMovieFilterQuery>
): Partial<IMovieFilter> => {
  const filterObject: Partial<IMovieFilter> = {};

  const keys = Object.keys(query) as Array<keyof IMovieFilterQuery>;

  keys.forEach((key) => {
    switch (key) {
      case 'ratingGte':
        filterObject.rating = Object.assign({}, filterObject.rating, {
          $gte: Number(query.ratingGte)
        });
        break;
      case 'ratingLte':
        filterObject.rating = Object.assign({}, filterObject.rating, {
          $lte: Number(query.ratingLte)
        });
        break;
      case 'releaseDateGte':
        filterObject.releaseDate = Object.assign({}, filterObject.releaseDate, {
          $gte: Number(query.releaseDateGte)
        });
        break;
      case 'releaseDateLte':
        filterObject.releaseDate = Object.assign({}, filterObject.releaseDate, {
          $lte: Number(query.releaseDateLte)
        });
        break;
      case 'name':
        filterObject.name = { $regex: query.name as string, $options: 'i' };
        break;
      default:
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        filterObject[key] = query[key];
    }
  });

  return filterObject;
};
