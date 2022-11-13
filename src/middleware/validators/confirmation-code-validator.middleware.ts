import { NextFunction, Response } from 'express';
import { confirmationCodeValidator } from '../../validators';
import { ErrorHandler } from '../../errors';
import { ResponseStatusCodesEnum } from '../../constants';
import { IRequestExtended } from 'src/models';

export const confirmationCodeValidatorMiddleware = (
  req: IRequestExtended,
  res: Response,
  next: NextFunction
) => {
  const { error } = confirmationCodeValidator.validate(req.body);

  if (error) {
    return next(
      new ErrorHandler(
        ResponseStatusCodesEnum.BAD_REQUEST,
        error.details[0].message
      )
    );
  }
  req.authCode = req.body.authCode;

  next();
};
