import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { Model } from 'mongoose';
import { UUID, ObjectId } from 'src/constants';
import { Collections } from 'src/enums';
import { hash } from 'src/shared/utils/string';
import { Player } from '../players/players.schema';
import { Team } from '../teams/teams.schema';

export interface IPlayerStatistic {
  playerId: typeof ObjectId;
  teamId: typeof ObjectId;
  goal?: number;
  goalHead?: number;
  autoGoal?: number;
  penalty?: number;
  mvp?: boolean;

  // More details
  // distance?: number;
  // position?: IPlayerPosition;
  // injure?: boolean;
  // pulse?: number;
}

export interface IGame {
  season: number;
  playedAt: Date;
  status: EnumGameStatus;
  statistics: {};
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
  playerId: typeof ObjectId;

  @ApiProperty({ type: String })
  @Prop({ type: ObjectId, ref: Team.name, required: true })
  teamId: typeof ObjectId;

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

  @ApiProperty({ default: false })
  @Prop({ type: Boolean })
  mvp?: boolean;
}

export const PlayerStatisticSchema =
  SchemaFactory.createForClass(PlayerStatistic);

@Schema({
  timestamps: true,
  versionKey: '_gen',
})
export class Game implements IGame {
  @ApiProperty({ default: 1 })
  @Prop({ type: Number })
  _id: number;

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

  @ApiProperty({ type: [PlayerStatistic] })
  @Prop({
    type: [PlayerStatisticSchema],
  })
  statistics: PlayerStatistic[];
}

// If you want to create a DTO for updating the game, you can use PartialType
export class UpdateGame extends PartialType(Game) {}

export const GameSchema = SchemaFactory.createForClass(Game);