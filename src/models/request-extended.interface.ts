import { Request } from 'express';
import { IMovie } from './movie.interface';

import { IUser } from './user.interface';
// import { IProduct } from "./product.interface";
// import { IStore } from "./store.interface";

export interface IRequestExtended extends Request {
  user?: IUser;
  movie?: IMovie;
  //   store?: IStore;
}
