import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { IUser, User } from './users.model';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<IUser>,
  ) {}

  async createUser({ settings, ...createUserDto }: any) {
    if (settings) {
      // const newSettings = new this.userSettingsModel(settings);
      // const savedNewSettings = await newSettings.save();
      const newUser = new this.userModel({
        ...createUserDto,
        // settings: savedNewSettings._id,
      });
      return newUser.save();
    }
    const newUser = new this.userModel(createUserDto);
    return newUser.save();
  }

  getsUsers() {
    return this.userModel.find().populate(['settings', 'posts']);
  }

  getUserById(id: string) {
    return this.userModel.findById(id).populate(['settings', 'posts']);
  }

  updateUser(id: string, updateUserDto: any) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
  }

  deleteUser(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }
}
