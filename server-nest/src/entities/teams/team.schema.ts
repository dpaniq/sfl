import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export interface ITeam {
  name: string;
  color: EnumTeamColor;
  description?: string;
}

export enum EnumTeamColor {
  White = 'WHITE',
  Red = 'RED',
}

@Schema({
  versionKey: false,
  toObject: {
    transform: (doc, ret, options) => {
      ret.id = ret._id;
      delete ret._id;
      return ret;
    },
  },
  toJSON: {
    transform: (doc, ret, options) => {
      ret.id = ret._id;
      delete ret._id;
      return ret;
    },
  },
})
export class Team {
  @ApiProperty()
  @Prop({ type: String, required: true, index: true, unique: true })
  name: string;

  @ApiProperty({ type: String, enum: EnumTeamColor, uniqueItems: true })
  @Prop({ type: String, enum: EnumTeamColor, unique: true })
  color: EnumTeamColor;

  @Prop({ type: String, default: null })
  description?: string | null;

  @Prop({ type: String, default: null })
  logo?: string | null;
}

export class UpdateTeam extends PartialType(Team) {}

export const TeamSchema = SchemaFactory.createForClass(Team);
