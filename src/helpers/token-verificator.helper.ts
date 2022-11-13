import { verify, VerifyErrors } from "jsonwebtoken";

import { ActionEnum, ResponseStatusCodesEnum } from "../constants";
import { config } from "../config";
import { customErrors, ErrorHandler } from "../errors";

export const tokenVerificator = (action: ActionEnum, token: string) => {
  try {
    let isValid;

    switch (action) {
      case ActionEnum.USER_AUTH:
        isValid = verify(token, config.JWT_SECRET) as VerifyErrors | null;
        break;

      case ActionEnum.USER_CODE_AUTH:
        isValid = verify(
          token,
          config.JWT_LOGIN_CODE_SECRET
        ) as VerifyErrors | null;
        break;

      case ActionEnum.REFRESH_TOKEN:
        isValid = verify(
          token,
          config.JWT_REFRESH_SECRET
        ) as VerifyErrors | null;
        break;

      case ActionEnum.USER_REGISTER:
        isValid = verify(
          token,
          config.JWT_CONFIRM_EMAIL_SECRET
        ) as VerifyErrors | null;
        break;

      case ActionEnum.FORGOT_PASSWORD:
        isValid = verify(
          token,
          config.JWT_PASS_RESET_SECRET
        ) as VerifyErrors | null;
        break;

      default:
        throw new ErrorHandler(
          ResponseStatusCodesEnum.INTERNAL_SERVER_ERROR,
          "wrong Action type"
        );
    }

    return isValid;
  } catch (e) {
    console.log(e);
    throw new ErrorHandler(
      ResponseStatusCodesEnum.UNAUTHORIZED,
      customErrors.UNAUTHORIZED_BAD_TOKEN.message
    );
  }
};
