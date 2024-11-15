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
    return this.userModel.find().populate(['settings', 'posts']);
  }

  getUserById(id: string) {
    console.log(id, this.userModel.findById(id).exec());
    return this.userModel.findById(id).populate(['roles']).exec();
  }

  updateUser(id: string, updateUserDto: any) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
  }

  async patch(id: string, body: Partial<IUser>): Promise<IUser | null> {
    try {
      await this.userModel.updateOne({ _id: id }, { $set: { ...body } }).exec();
      return await this.userModel.findById(id).exec();
    } catch (error) {
      return null;
    }
  }

  deleteUserById(id: string | mongoose.Types.UUID) {
    return this.userModel.findByIdAndDelete(new mongoose.Types.UUID(id));
  }
}
