import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { ObjectId, UUID } from 'src/constants';
import { User } from '../users';

export interface IPlayer {
  nickname: string;
  isCaptain?: boolean;
  position?: EnumPlayerPosition;
  status?: EnumPlayerStatus;
  userId: typeof UUID;
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

@Schema({
  versionKey: false,
  toObject: {
    transform: (doc, ret, options) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.userId;
      delete ret.__v;
      return ret;
    },
  },
  toJSON: {
    transform: (doc, ret, options) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.userId;
      delete ret.__v;
      return ret;
    },
  },
})
export class Player implements IPlayer {
  @ApiProperty()
  @Prop({
    type: String,
    index: true,
    required: true,
  })
  nickname: string;

  @ApiProperty()
  @Prop({ type: Boolean, default: false })
  isCaptain?: boolean;

  @ApiProperty()
  @Prop({
    type: String,
    enum: EnumPlayerStatus,
    default: EnumPlayerStatus.Inactive,
  })
  status?: EnumPlayerStatus;

  @ApiProperty()
  @Prop({ type: String, enum: EnumPlayerPosition })
  position?: EnumPlayerPosition;

  @ApiProperty()
  @Prop({
    type: [
      {
        type: UUID,
        ref: User.name,
        required: true,
        // TODO
        // validate: {
        //   validator: {},
        // },
      },
    ],
  })
  userId: typeof UUID;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
