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

  async updateUser(req: Request, res: Response, next: NextFunction) {
    console.log('updateUser');
    // todo додати мідлварку чи існує айдішнік
    const paramsForUpdating: IUser = req.body;
    await userService.updateUserByParams(
      { _id: req.params.id },
      paramsForUpdating
    );
    await logService.createLog({
      event: LogEnum.USER_UPDATED,
      userId: req.params.id,
      data: paramsForUpdating
    });
    // Todo розібратись з тим що повертає сервіс userService.updateUserByParams, чи нам об'єкт неопнятний потрібен чи наш оновлений юзер.
    const updatedUser = await userService.findOneByParams({
      _id: req.params.id
    });
    // TODO change status
    res.status(ResponseStatusCodesEnum.CREATED).json(updatedUser);
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
  async forgotPassword(
    req: IRequestExtended,
    res: Response,
    next: NextFunction
  ) {
    // тут бага: можна багато разів робити форгот пассворд
    const { _id, email } = req.user as IUser;
    const { access_token } = tokenizer(ActionEnum.FORGOT_PASSWORD);

    // це певно фіксає багу. Треба винести у мідлварку
    const isUserConfirmed = await userService.findOneByParams({
      _id,
      status: UserStatusEnum.CONFIRMED
    });
    if (!isUserConfirmed) {
      return next(
        new ErrorHandler(
          ResponseStatusCodesEnum.FORBIDDEN,
          customErrors.BAD_REQUEST_USER_NOT_ACTIVATED.message,
          customErrors.BAD_REQUEST_USER_NOT_ACTIVATED.code
        )
      );
    }

    await userService.addActionToken(_id, {
      token: access_token,
      action: ActionEnum.FORGOT_PASSWORD
    });
    await emailService.sendEmail(email, ActionEnum.FORGOT_PASSWORD, {
      token: access_token
    });
    res.end();
  }
  async setForgotPass(
    req: IRequestExtended,
    res: Response,
    next: NextFunction
  ) {
    const { _id } = req.user as IUser;
    const { password } = req.body;
    const token = req.get(RequestHeadersEnum.AUTHORIZATION) as string;

    const isUserConfirmed = await userService.findOneByParams({
      _id,
      status: UserStatusEnum.CONFIRMED
    });
    if (!isUserConfirmed) {
      return next(
        new ErrorHandler(
          ResponseStatusCodesEnum.FORBIDDEN,
          customErrors.BAD_REQUEST_USER_NOT_ACTIVATED.message,
          customErrors.BAD_REQUEST_USER_NOT_ACTIVATED.code
        )
      );
    }

    const hashPass = await hashPassword(password);
    const { modifiedCount: isPasswordUpdated } =
      await userService.updateUserByParams({ _id }, { password: hashPass });
    if (!isPasswordUpdated) {
      return next(
        new ErrorHandler(
          ResponseStatusCodesEnum.FORBIDDEN,
          customErrors.FORBIDDEN_USER_PASSWORD_NOT_UPDATED.message,
          customErrors.FORBIDDEN_USER_PASSWORD_NOT_UPDATED.code
        )
      );
    }
    await userService.removeActionTokenByUserId(
      _id,
      ActionEnum.FORGOT_PASSWORD,
      token
    );
    res.end();
  }
}

export const userController = new UserController();
