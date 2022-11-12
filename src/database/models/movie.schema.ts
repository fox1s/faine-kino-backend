import { Document, Model, model, Schema } from 'mongoose';

import { IMovie } from '../../models';
import { TableNamesEnum } from '../../constants';

export type MovieType = IMovie & Document;

export const MovieSchema: Schema = new Schema<IMovie>(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      required: true
    },
    duration: {
      type: String,
      required: true
    },
    releaseDate: {
      type: Number,
      required: true
    },
    rating: {
      type: Number,
      required: true
    },
    genres: {
      type: [String],
      required: true
    },
    path: {
      type: String,
      required: false
    }
    // actors: [actorsSubModel]
  },
  {
    timestamps: true
  }
);

export const MovieModel: Model<MovieType> = model<MovieType>(
  TableNamesEnum.MOVIE,
  MovieSchema
);
