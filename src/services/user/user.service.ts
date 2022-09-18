import { Types } from "mongoose";

import { UserModel } from "../../database";
import { IUser, IUserToken } from "../../models";
import { ActionEnum } from "../../constants";

class UserService {
  createUser(user: Partial<IUser>): Promise<IUser> {
    const userToCreate = new UserModel(user);

    return userToCreate.save();
  }

  // //   Replace update() with updateOne(), updateMany(), or replaceOne()
  //   addActionToken(userId: string, tokenObject: IUserToken): Promise<IUser> {
  //     return UserModel.update(
  //       { _id: Types.ObjectId(userId) },
  //       {
  //         $push: {
  //           tokens: tokenObject,
  //         },
  //       }
  //     ).exec();
  //   }

  //   updateUserByParams(
  //     params: Partial<IUser>,
  //     update: Partial<IUser>
  //   ): Promise<IUser> {
  //     return UserModel.updateOne(params, update, { new: true }).exec();
  //   }

  //   findOneByParams(findObject: Partial<IUser>): Promise<IUser | null> {
  //     return UserModel.findOne(findObject).exec();
  //   }

  //   findUserByActionToken(
  //     action: ActionEnum,
  //     token: string
  //   ): Promise<IUser | null> {
  //     return UserModel.findOne({
  //       $and: [{ "tokens.action": action }, { "tokens.token": token }],
  //     }) as any;
  //   }

  // removeActionToken(action: ActionEnum, token: string): Promise<IUser | null> {
  //   return UserModel.update(
  //     {},
  //     {
  //       $pull: {
  //         $and: [
  //           {'tokens.token': token},
  //           {'tokens.action': action}
  //         ]
  //       } as any
  //     }) as any;
  // }
}

export const userService = new UserService();
