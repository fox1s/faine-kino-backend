import { Types } from 'mongoose';

export interface IAccessToken {
  _id: string;
  accessToken: string;
  refreshToken: string ;
  userId: Types.ObjectId;
  createdAt: string;
}

export interface IAccessTokenResponse {
  accessToken: string;
  refreshToken: string;
  _id: string;
  name: string;
  surname: string;
  email: string;
  role: string;
  age: number;
  photo?: string;
  status: string;
}
