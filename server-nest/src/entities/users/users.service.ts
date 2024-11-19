import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import mongoose, { Model } from 'mongoose';
import { IUser, User } from './users.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<IUser>,
  ) {}

  async createUser(user: {
    email: string;
    name?: string;
    surname?: string;
    roles: string[];
  }) {
    if (!user.roles) {
      return null;
    }

    try {
      await this.userModel.create(user);

      return await this.userModel.findOne({ email: user.email }).exec();
    } catch (error) {
      console.log('errro?', error);
      return null;
    }
  }

  getsUsers() {
    return this.userModel.find().exec();
  }

  getUserById(id: string | mongoose.Types.UUID) {
    return this.userModel
      .findById(new mongoose.Types.UUID(id))
      .populate(['roles'])
      .exec();
  }

  updateUser(id: string | mongoose.Types.UUID, updateUserDto: any) {
    return this.userModel
      .findByIdAndUpdate(new mongoose.Types.UUID(id), updateUserDto, {
        new: true,
      })
      .exec();
  }

  async patch(
    id: string | mongoose.Types.UUID,
    body: Partial<IUser>,
  ): Promise<IUser | null> {
    try {
      await this.userModel
        .findOneAndUpdate(
          { _id: new mongoose.Types.UUID(id) },
          { $set: { ...body } },
        )
        .exec();
    } catch (error) {
      return null;
    }
  }

  deleteUserById(id: string | mongoose.Types.UUID) {
    return this.userModel.findByIdAndDelete(new mongoose.Types.UUID(id)).exec();
  }
}
