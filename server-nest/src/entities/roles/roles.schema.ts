import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { EnumRole } from './constants';

@Schema({ versionKey: false })
export class Role {
  @Prop({ type: String, enum: EnumRole, required: true, unique: true })
  name: boolean;

  @Prop()
  description?: boolean;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
