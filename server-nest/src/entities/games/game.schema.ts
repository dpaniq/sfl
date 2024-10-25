import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { ObjectId } from 'src/constants';
import { Player } from '../players/players.schema';
import { ITeam, Team } from '../teams/team.schema';

export interface IPlayerStatistic {
  playerId: string;
  teamId: string;
  goal?: number;
  goalHead?: number;
  autoGoal?: number;
  pass?: number;
  penalty?: number;
  mvp?: boolean;

  // More details
  // distance?: number;
  // position?: IPlayerPosition;
  // injure?: boolean;
  // pulse?: number;
  isCaptain: boolean;
}

export interface IGame {
  number: number;
  season: number;
  playedAt: Date;
  status: EnumGameStatus;
  teams: Record<string, ITeam>;
  statistics: PlayerStatistic[];
}

export enum EnumGameStatus {
  New = 'new',
  Draft = 'draft',
  Published = 'published',
}

@Schema({
  _id: false,
})
export class PlayerStatistic implements IPlayerStatistic {
  @ApiProperty({ type: String })
  @Prop({ type: ObjectId, ref: Player.name, required: true })
  playerId: string;

  @ApiProperty({ type: String })
  @Prop({
    type: ObjectId,
    ref: Team.name,
    required: true,
  })
  teamId: string;

  @ApiProperty()
  @Prop({ type: Number })
  goal?: number;

  @ApiProperty()
  @Prop({ type: Number })
  goalHead?: number;

  @ApiProperty()
  @Prop({ type: Number })
  autoGoal?: number;

  @ApiProperty()
  @Prop({ type: Number })
  penalty?: number;

  @ApiProperty()
  @Prop({ type: Number })
  pass?: number;

  @ApiProperty({ default: false })
  @Prop({ type: Boolean })
  mvp?: boolean;

  @ApiProperty({ type: Boolean, default: false })
  @Prop({ type: Boolean })
  isCaptain: boolean;
}

export const PlayerStatisticSchema =
  SchemaFactory.createForClass(PlayerStatistic);

@Schema({
  timestamps: true,
  versionKey: '_gen',
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
export class Game implements IGame {
  @ApiProperty({ default: 1 })
  @Prop({ type: Number, reuqired: true, index: true, unique: true })
  number: number;

  @ApiProperty({ default: 2010 })
  @Prop({ type: Number, reuqired: true, index: true })
  season: number;

  @ApiProperty()
  @Prop({ type: Date, required: true })
  playedAt: Date;

  @ApiProperty({ type: String, enum: EnumGameStatus })
  @Prop({
    type: String,
    enum: EnumGameStatus,
    required: true,
  })
  status: EnumGameStatus;

  @ApiProperty({ type: Object })
  @Prop({
    type: Object,
    required: true,
  })
  teams: Record<string, ITeam>;

  @ApiProperty({ type: [PlayerStatistic] })
  @Prop({
    type: [PlayerStatisticSchema],
  })
  statistics: PlayerStatistic[];
}

// If you want to create a DTO for updating the game, you can use PartialType
export class UpdateGame extends PartialType(Game) {}

export const GameSchema = SchemaFactory.createForClass(Game);
