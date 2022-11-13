import { IAccessTokenResponse, IUser } from 'src/models';

export const mapIUserAndITokensToIAuthResponse = (
  user: IUser,
  tokens: { accessToken: string; refreshToken: string }
): IAccessTokenResponse => {
  return {
    _id: user._id,
    name: user.name,
    surname: user.surname,
    email: user.email,
    role: user.role,
    age: user.age,
    photo: user.photo,
    status: user.status,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken
  };
};
