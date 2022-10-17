import { Router } from 'express';

import { movieController } from '../../controllers';
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
router.post('/', movieController.createMovie);

export const movieRouter = router;
