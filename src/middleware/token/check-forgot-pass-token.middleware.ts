import { NextFunction, Response } from 'express';

import {
  ActionEnum,
  RequestHeadersEnum,
  ResponseStatusCodesEnum
} from '../../constants';
import { customErrors, ErrorHandler } from '../../errors';
import { userService } from '../../services';
import { IRequestExtended } from '../../models';
import { tokenVerificator } from '../../helpers';

export const checkForgotPassTokenMiddleware = async (
  req: IRequestExtended,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.get(RequestHeadersEnum.AUTHORIZATION);

    if (!token) {
      return next(
        new ErrorHandler(
          ResponseStatusCodesEnum.BAD_REQUEST,
          customErrors.BAD_REQUEST_NO_TOKEN.message
        )
      );
    }

    tokenVerificator(ActionEnum.FORGOT_PASSWORD, token);

    const userByToken = await userService.findUserByActionToken(
      ActionEnum.FORGOT_PASSWORD,
      token
    );

    if (!userByToken) {
      return next(
        new ErrorHandler(
          ResponseStatusCodesEnum.NOT_FOUND,
          customErrors.NOT_FOUND.message
        )
      );
    }

    req.user = userByToken;

    next();
  } catch (e) {
    next(e);
  }
};
