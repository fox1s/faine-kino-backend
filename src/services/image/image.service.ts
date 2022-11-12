// import { Types } from 'mongoose';

import { ImageModel } from '../../database';
import { IImage } from '../../models';

class ImageService {
  // тут напевно маж створоюватись без imagesPaths
  createImagesPaths(imagesPaths: Partial<IImage>): Promise<IImage> {
    const imagesPathsToCreate = new ImageModel(imagesPaths);

    return imagesPathsToCreate.save();
  }

  findImagePathsByMovieId(findObject: Partial<IImage>): Promise<IImage | null> {
    // const skip = limit * (page - 1);

    // return MovieModel.find(filterQuery).limit(limit).skip(skip).lean().exec();
    console.log(ImageModel.findOne(findObject).exec());

    return ImageModel.findOne(findObject).exec();
  }

  updateImagesPaths(params: Partial<IImage>, update: Partial<IImage>) {
    return ImageModel.updateOne(params, update, { new: true }).exec();
  }

  // findOneByParams(findObject: Partial<IMovie>): Promise<IMovie | null> {
  //   return MovieModel.findOne(findObject).exec();
  // }
}

export const imageService = new ImageService();
