import { Router } from 'express';
import { imageUpload, posterUpload } from '../../helpers';

import { imageController } from '../../controllers';
import { checkIsMovieExistByIdMiddleware } from '../../middleware';

// import {
//   checkConfirmTokenMiddleware,
//   checkForgotPassTokenMiddleware,
//   checkIsEmailExistsMiddleware,
//   checkIsUserExistByEmailMiddleware,v
//   checkIsUserValidMiddleware,
//   emailValidatorMiddleware,
//   singlePasswordValidatorMiddleware
// } from '../../middleware';

const router = Router();

router.get('/:movieId', imageController.getImage);
router.get('/poster/:movieId', imageController.getPoster);
router.post(
  '/poster/upload/:movieId',
  checkIsMovieExistByIdMiddleware,
  // createImagesFolderMiddleware,
  posterUpload.single('poster'),
  imageController.uploadPoster
);
router.post(
  '/upload/:movieId',
  checkIsMovieExistByIdMiddleware,
  (r, res, next)=> {console.log('tyt'); next();},
  imageUpload.array('images', 10),
  imageController.uploadImages
);

export const imageRouter = router;
