import {Schema, model} from 'mongoose';
import {useUserModelReference} from '../utils/refs';
import {EnumUserCollection, IUser, UserModel} from './user.model';

export interface IPlayer {
  nickname: string;
  isCaptain?: boolean;
  position?: EnumPlayerPosition;
  status: EnumPlayerStatus;
  userId: IUser;
}

export enum EnumPlayerStatus {
  Deceased = 'DECEASED',
  Retired = 'RETIRED',
  Inactive = 'INACTIVE',
  Injured = 'INJURED',
  Active = 'ACTIVE',
}

export enum EnumPlayerPosition {
  Goalkeeper = 'GK',
  DefenderCenter = 'DEF-C',
  DefenderLeft = 'DEF-L',
  DefenderRight = 'DEF-R',
  MidfielderCenter = 'MID-C',
  MidfielderWingerLeft = 'MID-W-L',
  MidfielderWingerRight = 'MID-W-R',
  ForwardStriker = 'FOR-ST',
}

export enum EnumPlayerCollection {
  Player = 'players',
  Test = '_players_tests',
}

export const PlayerSchema = new Schema<IPlayer>({
  nickname: {type: String, index: true},
  isCaptain: {type: Boolean, default: false},
  status: {type: String, enum: EnumPlayerStatus},
  position: {type: String, enum: EnumPlayerPosition},
  userId: useUserModelReference(EnumUserCollection.User, UserModel),
});

export const PlayerModel = model<IPlayer>(EnumPlayerCollection.Player, PlayerSchema);
