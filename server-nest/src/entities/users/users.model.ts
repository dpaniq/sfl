import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { Model } from 'mongoose';
import { UUID, ObjectId } from 'src/constants';
import { Collections } from 'src/enums';
import { hash } from 'src/shared/utils/string';

export interface IUser {
  _id: string;
  name: string;
  surname: string;
  avatar: string;
  age: number;
  email: string;
  password: string;
  roles: [];
}

@Schema({ versionKey: false })
export class User implements IUser {
  @ApiProperty()
  @Prop({
    default: () => randomUUID(),
    type: UUID,
    required: true,
    transform: (id: any) => id.toString(),
  })
  _id: string;

  @ApiProperty()
  @Prop({ type: String })
  name: string;

  @ApiProperty()
  @Prop({ type: String })
  surname: string;

  @ApiProperty()
  @Prop({ type: String })
  avatar: string;

  @ApiProperty()
  @Prop({ type: Number })
  age: number;

  @ApiProperty()
  @Prop({ required: true, unique: true, match: /^\S+@\S+\.\S+$/ })
  email: string;

  @ApiProperty()
  @Prop({ required: true, default: () => hash(randomUUID()) })
  password: string;

  // Assuming you have defined EnumRoleCollection and RoleModel elsewhere
  // Adjust this part based on your actual setup
  @ApiProperty()
  @Prop({
    type: [
      {
        type: ObjectId,
        ref: Collections.Roles,
        required: true,
      },
    ],
    // validate: {
    //   validator: async (array: any[]) => {
    //     const rolesCount = await Role.countDocuments({ _id: { $in: array } });
    //     return (
    //       Array.isArray(array) &&
    //       array.length > 0 &&
    //       array.length === rolesCount
    //     );
    //   },
    //   message: 'At least one role is required.',
    // },
  })
  roles: []; // TODO roles;

  // You might need to adjust this if `useRoleModelReference` returns something specific
  // such as a reference to another schema
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserMongoModel = Model<IUser>;
