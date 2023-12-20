import {Schema, model, connect, Document} from 'mongoose';

export interface IRole {
  name: string;
  description?: string;
}

export enum EnumRole {
  Admin = 'ADMIN',
  Moderator = 'MODERATOR',
  User = 'USER',
  Guest = 'GUEST',
  QA = 'QA',
}

export enum EnumRoleCollection {
  Roles = 'roles',
  Test = '_roles_tests',
}

export const RoleSchema = new Schema<IRole>(
  {
    name: {type: String, enum: EnumRole, required: true, unique: true},
    description: String,
  },
  {
    versionKey: false,
  },
);

export const RoleModel = model<IRole>(EnumRoleCollection.Roles, RoleSchema);
