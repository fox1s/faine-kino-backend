import { ActionEnum } from '../constants';

export const htmlTemplates: {
  [index: string]: { subject: string; templateFileName: string };
} = {
  [ActionEnum.USER_REGISTER]: {
    subject: '[Faine-kino] Please confirm your email',
    templateFileName: 'user-welcome'
  },
  [ActionEnum.FORGOT_PASSWORD]: {
    subject: '[Faine-kino] Forgot password',
    templateFileName: 'forgot-password'
  }
};
