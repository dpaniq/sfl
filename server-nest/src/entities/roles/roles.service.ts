import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from './roles.schema';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name)
    private rolesModel: Model<Role>,
  ) {}

  async create(body: { name: string; description?: string }): Promise<Role> {
    const role = new this.rolesModel(body);
    return role.save();
  }
}
