import {Schema, model} from 'mongoose';

export interface ITeam {
  name: string;
  description?: string;
  color: EnumTeamColor;
}

export enum EnumTeamColor {
  White = 'WHITE',
  Red = 'RED',
}

export enum EnumTeamCollection {
  Team = 'teams',
  Test = '_teams_tests',
}

export const TeamSchema = new Schema<ITeam>(
  {
    name: {type: String, required: true, index: true, unique: true},
    description: String,
    color: {type: String, enum: EnumTeamColor, unique: true},
  },
  {
    versionKey: false,
  },
);

export const TeamModel = model<ITeam>(EnumTeamCollection.Team, TeamSchema);
