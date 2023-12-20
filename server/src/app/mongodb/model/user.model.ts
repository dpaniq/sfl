import {Schema, model, connect} from 'mongoose';
import {IRole, EnumRoleCollection, RoleModel} from './role.model';
import {useRoleModelReference} from '../utils/refs';
import {randomUUID} from 'crypto';
import {hash} from '../../utils/crypto';

export interface IUser {
  _id: Schema.Types.UUID;
  email: string;
  password: string;
  name?: string;
  surname?: string;
  avatar?: string;
  age?: number;
  roles: IRole[];
}

export type IUserPublic = Omit<IUser, '_id' | 'password'>;

export enum EnumUserCollection {
  User = 'users',
  Test = '_users_tests',
}

export const UserSchema = new Schema<IUser>(
  {
    _id: {
      type: Schema.Types.UUID,
      default: randomUUID(),
      required: true,
    },
    name: String,
    surname: String,
    avatar: String,
    age: Number,
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^\S+@\S+\.\S+$/,
    },
    password: {
      type: String,
      required: true,
      default: () => hash(randomUUID()),
    },
    roles: useRoleModelReference(EnumRoleCollection.Roles, RoleModel),
  },
  {
    versionKey: false,
  },
);
// .pre('find', function (next) {
//   this.populate('roles');
//   next();
// });

export const UserModel = model<IUser>(EnumUserCollection.User, UserSchema);
