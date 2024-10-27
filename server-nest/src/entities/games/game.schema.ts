import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { ObjectId } from 'src/constants';
import { EnumPlayerPosition, Player } from '../players/players.schema';
import { ITeam, Team } from '../teams/team.schema';

export interface IPlayerStatistic {
  playerId: string;
  teamId: string;
  isCaptain: boolean;

  // TODO! update optionals to required
  // Optional
  goal: number;
  goalHead: number;
  pass: number;
  penalty: number;
  mvp: boolean;
  autoGoal?: number;
  position?: EnumPlayerPosition;

  // More details
  // distance?: number;
  // position?: IPlayerPosition;
  // injure?: boolean;
  // pulse?: number;
}

export interface IGameMetadata {
  // Common
  totalPlayers: number;
  totalGoals: number;
  totalGoalsByLeg: number;
  totalGoalsByHead: number;
  totalGoalsByPenalty: number;
  totalGoalsByAuto: number;
  totalPasses: number;
  totalPoints: number;

  // Team
  teamWon: string | null; // null if scoreIsDraw
  teamLost: string | null; // null if scoreIsDraw

  // Score
  score: [number, number];
  scoreIsDraw: boolean;
  scoreFirstDraft: number;
  scoreSecondDraft: number;

  // Captains
  captainFirstDraft: string;
  captainSecondDraft: string;
  captainWon: string | null; // null if scoreIsDraw
  captainLost: string | null; // null if scoreIsDraw
  isCaptainFirstDraftWon: boolean;
  isCaptainFirstDraftDraw: boolean;
  isCaptainFirstDraftLost: boolean;
  isCaptainSecondDraftWon: boolean;
  isCaptainSecondDraftDraw: boolean;
  isCaptainSecondDraftLost: boolean;

  // Players
  playersByPosition?: {
    [key in EnumPlayerPosition]: number;
  };

  // Mpv
  mvpByGoalsIds: string[];
  mvpByGoalsHeadIds: string[];
  mvpByPassesIds: string[];
  mvpListIds: string[];
}

export interface IGame {
  number: number;
  season: number;
  playedAt: Date;
  status: EnumGameStatus;
  teams: [ITeam, ITeam];
  statistics: PlayerStatistic[];
  metadata: IGameMetadata;
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
  @Prop({ type: Number, required: true, default: 0 })
  goal: number;

  @ApiProperty()
  @Prop({ type: Number, required: true, default: 0 })
  goalHead: number;

  @ApiProperty()
  @Prop({ type: Number, required: false, default: 0 })
  autoGoal?: number;

  @ApiProperty()
  @Prop({ type: Number, required: true, default: 0 })
  penalty: number;

  @ApiProperty()
  @Prop({ type: Number, required: true, default: 0 })
  pass: number;

  @ApiProperty({ default: false, required: true })
  @Prop({ type: Boolean })
  mvp: boolean;

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

  @ApiProperty({ type: Object, isArray: true })
  @Prop({
    type: Object,
    required: true,
  })
  teams: [ITeam, ITeam];

  @ApiProperty({ type: [PlayerStatistic] })
  @Prop({
    type: [PlayerStatisticSchema],
  })
  statistics: PlayerStatistic[];

  @Prop({ type: Object, required: false, default: {} })
  metadata: IGameMetadata;
}

// If you want to create a DTO for updating the game, you can use PartialType
export class UpdateGame extends PartialType(Game) {}

export const GameSchema = SchemaFactory.createForClass(Game);
