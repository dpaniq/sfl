import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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
})
export class Team {
  @Prop({ type: String, required: true, index: true, unique: true })
  name: string;

  @Prop({ type: String, enum: EnumTeamColor, unique: true })
  color: EnumTeamColor;

  @Prop({ type: String })
  description?: String;
}

export const TeamSchema = SchemaFactory.createForClass(Team);
