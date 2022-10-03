import { NextFunction, Request, Response } from 'express';

import {
  ActionEnum,
  LogEnum,
  RequestHeadersEnum,
  ResponseStatusCodesEnum,
  UserStatusEnum
} from '../../constants';
import { hashPassword, tokenizer } from '../../helpers';

import { emailService, logService, userService } from '../../services';

import {
  IRequestExtended
  //   IUser
} from '../../models';
import { IUser } from '../../models';
import { customErrors, ErrorHandler } from '../../errors';

class UserController {
  async createUser(req: Request, res: Response, next: NextFunction) {
    console.log('createUser');
    const user: IUser = req.body;
    user.password = await hashPassword(user.password);
    const { _id } = await userService.createUser(user);
    const { access_token } = tokenizer(ActionEnum.USER_REGISTER);

    await userService.addActionToken(_id, {
      action: ActionEnum.USER_REGISTER,
      token: access_token
    });

    try {
      await emailService.sendEmail(user.email, ActionEnum.USER_REGISTER, {
        token: access_token
      });
    } catch (e) {
      console.log('emailService error: ', e);
    }

    await logService.createLog({ event: LogEnum.USER_REGISTERED, userId: _id });
    res.sendStatus(ResponseStatusCodesEnum.CREATED);
  }

  async confirmUser(req: IRequestExtended, res: Response, next: NextFunction) {
    const { _id, status } = req.user as IUser;
    const token = req.get(RequestHeadersEnum.AUTHORIZATION) as string;

    if (status !== UserStatusEnum.PENDING) {
      return next(
        new ErrorHandler(
          ResponseStatusCodesEnum.BAD_REQUEST,
          customErrors.BAD_REQUEST_USER_ACTIVATED.message,
          customErrors.BAD_REQUEST_USER_ACTIVATED.code
        )
      );
    }

    const { modifiedCount: isUserTokenDeleted } =
      await userService.removeActionTokenByUserId(
        _id,
        ActionEnum.USER_REGISTER,
        token
      );
    if (!isUserTokenDeleted) {
      return next(
        new ErrorHandler(
          ResponseStatusCodesEnum.FORBIDDEN,
          customErrors.FORBIDDEN_USER_NOT_CONFIRMED.message,
          customErrors.FORBIDDEN_USER_NOT_CONFIRMED.code
        )
      );
    }

    const { modifiedCount: isUserConfirmed } =
      await userService.updateUserByParams(
        { _id },
        { status: UserStatusEnum.CONFIRMED }
      );
    if (!isUserConfirmed) {
      return next(
        new ErrorHandler(
          ResponseStatusCodesEnum.FORBIDDEN,
          customErrors.FORBIDDEN_USER_NOT_CONFIRMED.message,
          customErrors.FORBIDDEN_USER_NOT_CONFIRMED.code
        )
      );
    }
    await logService.createLog({ event: LogEnum.USER_CONFIRMED, userId: _id });
    res
      // .sendStatus(ResponseStatusCodesEnum.CREATED)
      // .json({ message: "Confirmed" })
      .end();
  }
  //   async forgotPassword(req: IRequestExtended, res: Response, next: NextFunction) {
  //     const {_id, email} = req.user as IUser;
  //     const {access_token} = tokinizer(ActionEnum.FORGOT_PASSWORD);
  //     await userService.addActionToken(_id, {token: access_token, action: ActionEnum.FORGOT_PASSWORD});
  //     await emailService.sendEmail(email, ActionEnum.FORGOT_PASSWORD, {token: access_token});
  //     res.end();
  //   }
  //   async setForgotPass(req: IRequestExtended, res: Response, next: NextFunction) {
  //     const {_id, tokens = []} = req.user as IUser;
  //     const {password} = req.body;
  //     const tokenToDelete = req.get(RequestHeadersEnum.AUTHORIZATION);
  //     const hashPass = await hashPassword(password);
  //     await userService.updateUserByParams({_id}, {password: hashPass});
  //     const index = tokens.findIndex(({action, token}) => {
  //       return token === tokenToDelete && action === ActionEnum.FORGOT_PASSWORD;
  //     });
  //     if (index !== -1) {
  //       tokens.splice(index, 1);
  //       await userService.updateUserByParams({_id}, {tokens} as Partial<IUser>);
  //     }
  //     res.end();
  //   }
}

export const userController = new UserController();
