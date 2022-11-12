import { NextFunction, Response } from 'express';
import * as fs from 'node:fs/promises';

import { IRequestExtended } from '../../models';

export const createImagesFolderMiddleware = async (
  req: IRequestExtended,
  res: Response,
  next: NextFunction
): Promise<void | NextFunction> => {
  console.log('dfsgfd', req.movie?._id.toString() as string);
  await fs.mkdir('../imageDB/' + req.movie?._id.toString() as string);
  console.log('dfsgfd');
  next();
};
