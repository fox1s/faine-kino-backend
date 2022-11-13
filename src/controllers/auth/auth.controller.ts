import { NextFunction, Request, Response } from 'express';

import { authCodeCreator } from '../../helpers';
import { IRequestExtended, IUser } from '../../models';
import {
  comparePassword,
  mapIUserAndITokensToIAuthResponse,
  tokenizer
} from '../../helpers';
import {
  ActionEnum,
  LogEnum,
  RequestHeadersEnum,
  ResponseStatusCodesEnum
} from '../../constants';
import {
  authService,
  emailService,
  logService,
  userService
} from '../../services';
import { customErrors, ErrorHandler } from '../../errors';
import { Types } from 'mongoose';

class AuthController {
  async authUser(req: IRequestExtended, res: Response, next: NextFunction) {
    try {
      const { _id, password, email } = req.user as IUser;
      const authInfo = req.body;

      const isPasswordEquals = await comparePassword(
        authInfo.password,
        password
      );
      if (!isPasswordEquals) {
        return next(
          new ErrorHandler(
            ResponseStatusCodesEnum.NOT_FOUND,
            customErrors.NOT_FOUND.message
          )
        );
      }

      const { access_token } = tokenizer(ActionEnum.USER_CODE_AUTH);

      const authCode = authCodeCreator();
      await userService.addActionToken(_id, {
        action: ActionEnum.USER_CODE_AUTH,
        token: access_token,
        authCode
      });

      try {
        await emailService.sendEmail(email, ActionEnum.USER_CODE_AUTH, {
          code: authCode
        });
      } catch (e) {
        console.log('emailService error: ', e);
      }

      await logService.createLog({
        event: LogEnum.USER_TRY_TO_LOGIN,
        userId: _id
      });

      // res.sendStatus(ResponseStatusCodesEnum.CREATED);
      res.json({
        accessToken: access_token
      });

      // const { access_token, refresh_token } = tokenizer(ActionEnum.USER_AUTH);

      // await authService.createTokenPair({
      //   accessToken: access_token,
      //   refreshToken: refresh_token,
      //   userId: new Types.ObjectId(_id)
      // });

      // res.json(
      //   mapIUserAndITokensToIAuthResponse(req.user as IUser, {
      //     accessToken: access_token,
      //     refreshToken: refresh_token
      //   })
      // );
    } catch (e) {
      return next(e);
    }
  }

  async authCodeConfirmation(
    req: IRequestExtended,
    res: Response,
    next: NextFunction
  ) {
    const actionTokenForLogination = req.get(RequestHeadersEnum.AUTHORIZATION) as string;
    const { _id } = req.user as IUser;

    const userByActionTokenAndAuthCode = await userService.findUserByActionTokenAndAuthCode(
      ActionEnum.USER_CODE_AUTH,
      actionTokenForLogination,
      req.authCode as number
    );
    console.log(userByActionTokenAndAuthCode);

    if (!userByActionTokenAndAuthCode) {
      return next(
        new ErrorHandler(
          ResponseStatusCodesEnum.NOT_FOUND,
          customErrors.NOT_FOUND.message
        )
      );
    }

    await userService.removeActionTokenByUserId(
      _id,
      ActionEnum.USER_CODE_AUTH,
      actionTokenForLogination
    );

    const { access_token, refresh_token } = tokenizer(ActionEnum.USER_AUTH);

    await authService.createTokenPair({
      accessToken: access_token,
      refreshToken: refresh_token,
      userId: new Types.ObjectId(_id)
    });

    await logService.createLog({
      event: LogEnum.USER_LOGGED,
      userId: _id
    });

    res.json(
      mapIUserAndITokensToIAuthResponse(req.user as IUser, {
        accessToken: access_token,
        refreshToken: refresh_token
      })
    );
  }

  async refreshToken(req: IRequestExtended, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.get(RequestHeadersEnum.AUTHORIZATION);
      const { _id } = req.user as IUser;

      const { access_token, refresh_token } = tokenizer(ActionEnum.USER_AUTH);

      await authService.removeToken({ refreshToken });

      await authService.createTokenPair({
        accessToken: access_token,
        refreshToken: refresh_token,
        userId: new Types.ObjectId(_id)
      });

      res.json({
        accessToken: access_token,
        refreshToken: refresh_token
      });
    } catch (e) {
      return next(e);
    }
  }

  async logoutUser(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.get(RequestHeadersEnum.AUTHORIZATION);

    await authService.removeToken({ accessToken });

    res.sendStatus(ResponseStatusCodesEnum.NO_CONTENT);
  }
}

export const authController = new AuthController();
