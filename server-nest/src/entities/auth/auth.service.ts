import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserSchemaModel } from '../users';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: UserSchemaModel,
  ) {}

  async getsUsers() {
    return await this.userModel.find().exec(); //.populate(['settings', 'posts']);
  }
}
