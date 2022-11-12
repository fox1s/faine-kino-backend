import { Document, Model, model, Schema } from 'mongoose';

import { IImage } from '../../models';
import { TableNamesEnum } from '../../constants';

export type ImageType = IImage & Document;

export const ImageSchema: Schema = new Schema<IImage>(
  {
    movieId: {
      type: Schema.Types.ObjectId,
      required: true
    },
    posterPath: {
      type: String
    },
    imagesPath: {
      type: [String]
    }
  },
  {
    timestamps: true
  }
);

export const ImageModel: Model<ImageType> = model<ImageType>(
  TableNamesEnum.IMAGES,
  ImageSchema
);
