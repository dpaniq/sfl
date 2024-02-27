// import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
// import { randomUUID } from 'crypto';

// import { hash } from 'src/shared/utils/string';
// import { Collections } from 'src/enums';
// import { ObjectId, UUID } from 'src/constants';
// import { RoleSchema } from '../roles/roles.schema';
// import { UserAbstract } from './users.model';
// import { ApiParam, ApiProperty } from '@nestjs/swagger';

// @Schema({ versionKey: false })
// export class User extends UserAbstract {
//   @ApiProperty()
//   @Prop({
//     default: () => randomUUID(),
//     type: UUID,
//     required: true,
//   })
//   _id: string;

//   @Prop({ type: String })
//   name: string;

//   @Prop({ type: String })
//   surname: string;

//   @Prop({ type: String })
//   avatar: string;

//   @Prop({ type: Number })
//   age: number;

//   @Prop({ required: true, unique: true, match: /^\S+@\S+\.\S+$/ })
//   email: string;

//   @Prop({ required: true, default: () => hash(randomUUID()) })
//   password: string;

//   // Assuming you have defined EnumRoleCollection and RoleModel elsewhere
//   // Adjust this part based on your actual setup
//   @Prop({
//     type: [
//       {
//         type: ObjectId,
//         ref: Collections.Roles,
//         required: true,
//       },
//     ],
//     // validate: {
//     //   validator: async (array: any[]) => {
//     //     const rolesCount = await Role.countDocuments({ _id: { $in: array } });
//     //     return (
//     //       Array.isArray(array) &&
//     //       array.length > 0 &&
//     //       array.length === rolesCount
//     //     );
//     //   },
//     //   message: 'At least one role is required.',
//     // },
//   })
//   roles: []; // TODO roles;

//   // You might need to adjust this if `useRoleModelReference` returns something specific
//   // such as a reference to another schema
// }

// export const UserSchema = SchemaFactory.createForClass(User);
