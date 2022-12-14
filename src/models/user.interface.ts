import { ActionEnum } from '../constants';

export interface IUserToken {
  token?: string;
  action?: ActionEnum;
}

export interface IUserMovies {
  favorites: Array<string>;
  watch_later: Array<string>;
}

export interface IUser {
  _id: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  role: string;
  age: number;
  phone?: string;
  gender?: string;
  photo?: string;
  status: string;
  movies?: [IUserMovies];
  tokens?: [IUserToken];
  createdAt: string;
}
