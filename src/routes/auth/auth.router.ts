import { Router } from 'express';
import { authController } from '../../controllers';
import {
  checkAccessTokenMiddleware,
  checkAuthCodeAccessTokenMiddleware,
  checkIsUserConfirmedMiddleware,
  checkIsUserExistByEmailMiddleware,
  checkRefreshTokenMiddleware,
  confirmationCodeValidatorMiddleware,
  emailPasswordValidatorMiddleware
} from '../../middleware';

const router = Router();

router.post(
  '/',
  emailPasswordValidatorMiddleware,
  checkIsUserExistByEmailMiddleware,
  checkIsUserConfirmedMiddleware,
  authController.authUser
);
router.post(
  '/code-confirmation',
  checkAuthCodeAccessTokenMiddleware,
  confirmationCodeValidatorMiddleware,
  authController.authCodeConfirmation
);
router.post('/logout', checkAccessTokenMiddleware, authController.logoutUser);
router.post('/refresh', checkRefreshTokenMiddleware, authController.refreshToken);

export const authRouter = router;
