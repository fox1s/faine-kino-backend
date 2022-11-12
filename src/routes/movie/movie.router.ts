import { Router } from 'express';
import { movieUpload } from '../../helpers';

import { movieController } from '../../controllers';
import { checkIsMovieExistByIdMiddleware } from '../../middleware';
// import {
//   checkConfirmTokenMiddleware,
//   checkForgotPassTokenMiddleware,
//   checkIsEmailExistsMiddleware,
//   checkIsUserExistByEmailMiddleware,
//   checkIsUserValidMiddleware,
//   emailValidatorMiddleware,
//   singlePasswordValidatorMiddleware
// } from '../../middleware';

const router = Router();

router.get('/', movieController.getMovies);
router.get('/:movieId', movieController.getMovie);
router.post('/', movieController.createMovie);
router.post(
  '/upload/:movieId',
  checkIsMovieExistByIdMiddleware,
  movieUpload.single('movie'),
  movieController.uploadMovie
);
// router.post(
//   '/images/upload/:movieId',
//   checkIsMovieExistByIdMiddleware,
//   imageUpload.array('images', 10),
//   movieController.uploadImages,
//   (req: any, res: any) => {
//     res.json({ status: 'Saved' });
//   }
// );

export const movieRouter = router;
