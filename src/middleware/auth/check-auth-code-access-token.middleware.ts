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

export const checkAuthCodeAccessTokenMiddleware = async (
  req: IRequestExtended,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const actionToken = req.get(RequestHeadersEnum.AUTHORIZATION);

    if (!actionToken) {
      return next(
        new ErrorHandler(
          ResponseStatusCodesEnum.BAD_REQUEST,
          customErrors.BAD_REQUEST_NO_TOKEN.message
        )
      );
    }

    tokenVerificator(ActionEnum.USER_CODE_AUTH, actionToken);

    const userByActionToken = await userService.findUserByActionToken(ActionEnum.USER_CODE_AUTH, actionToken);

    if (!userByActionToken) {
      return next(
        new ErrorHandler(
          ResponseStatusCodesEnum.NOT_FOUND,
          customErrors.NOT_FOUND.message
        )
      );
    }

    req.user = userByActionToken;

    next();
  } catch (e) {
    next(e);
  }
};
