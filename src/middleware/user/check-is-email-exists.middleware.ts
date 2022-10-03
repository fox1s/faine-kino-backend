import { NextFunction, Request, Response } from 'express';

import { userService } from '../../services';
import { customErrors, ErrorHandler } from '../../errors';
import { ResponseStatusCodesEnum } from '../../constants';

export const checkIsEmailExistsMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;
  const user = await userService.findOneByParams({ email });

  if (user) {
    return next(
      new ErrorHandler(
        ResponseStatusCodesEnum.BAD_REQUEST,
        customErrors.BAD_REQUEST_USER_REGISTERED.message,
        customErrors.BAD_REQUEST_USER_REGISTERED.code
      )
    );
  }

  next();
};
