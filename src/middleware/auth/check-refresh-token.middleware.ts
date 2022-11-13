import { NextFunction, Response } from 'express';

import {
  ActionEnum,
  RequestHeadersEnum,
  ResponseStatusCodesEnum
} from '../../constants';
import { customErrors, ErrorHandler } from '../../errors';
import { authService } from '../../services';
import { IRequestExtended } from '../../models';
import { tokenVerificator } from '../../helpers';

export const checkRefreshTokenMiddleware = async (
  req: IRequestExtended,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const refresh_token = req.get(RequestHeadersEnum.AUTHORIZATION);

    if (!refresh_token) {
      return next(
        new ErrorHandler(
          ResponseStatusCodesEnum.BAD_REQUEST,
          customErrors.BAD_REQUEST_NO_TOKEN.message
        )
      );
    }

    tokenVerificator(ActionEnum.REFRESH_TOKEN, refresh_token);

    const userByToken = await authService.findUserByToken({
      refreshToken: refresh_token
    });

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
