import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { UUID } from 'src/constants';
import { User } from '../users';

export interface ServerPlayer {
  id: string;
  nickname: string;
  isCaptain?: boolean;
  position?: EnumPlayerPosition;
  status?: EnumPlayerStatus;
  number?: number;
  user: typeof UUID;

  metadata: TPlayerMetadata;
}

export interface IRatingSystem {
  /**
   * +/- Statistics
   *
   * +1 points if you goal scored by your team while you were on the field
   * -1 point if you goal scored by the opponent while you were on the field
   *
   * Represents players impact.
   */
  plusMinus: number;

  /**
   * LR: Last Result Statistics
   *
   * +1 point if your team won the match
   * -1 point if your team lost the match
   *
   * Represents the outcome (common result) of the games.
   */
  lastResult: number;

  /**
   * Total Points Statistics
   *
   * Represents the total points accumulated by the player.
   *
   * This value is calculated individually for different rating systems,
   * reflecting the player's performance across various metrics.
   */
  totalPoints: number;
}

export interface IAncientRatingSystem extends IRatingSystem {
  /**
   * Total Points Statistics
   *
   * Represents the total points accumulated by the player.
   *
   * This value is calculated individually for different rating systems,
   * reflecting the player's performance across various metrics.
   *
   * +1 points for pass
   * +1 points for regular goal or penalty
   * +2 points for goal by head
   */
  totalPoints: number;
}

export interface IPositionalRatingSystem extends IRatingSystem {
  /**
   * Total Points Statistics
   *
   * Represents the total points accumulated by the player.
   *
   * This value is calculated individually for different rating systems,
   * reflecting the player's performance across various metrics.
   *
   * GL: Goalkeeper
   * +4 if game is won
   * -4 if game is lost
   *
   * D: Defender
   * +3 if game is won
   * -3 if game is lost
   *
   * M: Midfielder | Winger
   * +2 if game is won
   * -2 if game is lost
   *
   * F: Forward
   * +1 if game is won
   * -1 if game is lost
   *
   * +1 points for pass
   * +1 points for regular goal or penalty
   * +2 points for goal by head
   */
  totalPoints: number;
}

export interface IPlayerMetadata {
  totalGoalsByLeg: number;
  totalGoalsByHead: number;
  totalGoalsByPenalty: number;
  totalGoalsByAuto: number;
  totalGoals: number;
  totalPasses: number;

  totalGames: number;
  totalWonGames: number;
  totalDraws: number;
  totalLostGames: number;

  totalPlayedAsTransfer: number;
  totalPlayedAsCaptain: number;
  totalPlayedAsFirstDraft: number;
  totalPlayedAsSecondDraft: number;

  gamesIds: string[];
  gameResults: [boolean];
  gameMaxWinGameStreak: number;
  gameMaxLostGameStreak: number;

  /**
   * List of games where the player served as captain.
   *
   * Example:
   * [
   *   gameId-1, // Game ID 1 where the player was captain
   *   gameId-n  // Game ID n where the player was captain
   * ]
   */
  captained: string[];

  /**
   * Captained by statistics: Count of how many times each player was under the captaincy.
   *
   * Example:
   * [
   *   playerId-1,
   *   playerId-n,
   * ]
   */
  captainedBy: string[];

  ancientRatingSystem: IAncientRatingSystem;
  positionalRatingSystem: IPositionalRatingSystem;
}

export type TPlayerMetadata = IPlayerMetadata & {
  games: Record<number, IPlayerMetadata & Record<number, IPlayerMetadata>>;
};

export interface ClientPlayer {
  id: string;

  number: number;
  avatar: number;
  isCaptain: boolean;

  nickname: string;
  name: string;
  surname: string;

  totalGames: number;
  draws: number;
  lostGames: number;
  wonGames: number;
  maxWinStreak: number;
  maxLostStreak: number;

  user: User;

  metadata: TPlayerMetadata;
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

const transform = (doc, ret, options) => {
  ret.id = ret._id;
  delete ret._id;
  delete ret._gen;
  delete ret.user?.password;
  return ret;
};

@Schema({
  versionKey: '_gen',

  toObject: {
    transform,
  },
  toJSON: {
    transform,
  },
})
export class Player implements ServerPlayer {
  @ApiProperty()
  @Prop({
    type: String,
    index: true,
    required: true,
  })
  nickname: string;

  @ApiProperty({ required: false })
  @Prop({ type: Boolean, default: false })
  isCaptain?: boolean;

  @ApiProperty({ required: false })
  @Prop({
    type: String,
    enum: EnumPlayerStatus,
    default: EnumPlayerStatus.Inactive,
  })
  status?: EnumPlayerStatus;

  @ApiProperty({ required: false })
  @Prop({ type: String, enum: EnumPlayerPosition })
  position?: EnumPlayerPosition;

  @ApiProperty({ required: false })
  @Prop({ type: Number, isInteger: true, index: true })
  number?: number;

  // TODO PROBLEM does not resolve user by ref
  @ApiProperty()
  @Prop({
    type: [
      {
        type: UUID,
        ref: User.name,
        required: true,
        unique: true,
      },
    ],
    transform: (docs) => docs.at(0),
  })
  user: typeof UUID;

  // Problem
  // @ApiProperty()
  // @Prop({
  //   type: {
  //     type: UUID,
  //     ref: User.name,
  //     required: true,
  //     unique: true,
  //   },
  // })
  // user: typeof UUID;

  @Prop({ type: Object, required: false, default: {} })
  metadata: TPlayerMetadata;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);

// user bogdan: b21439b9-87ff-4646-b9e1-780797c887e8
// apply / use
// db.players.updateMany({}, {$rename: {userId: "user"}})
// db.players.updateMany({}, {$unset: {__v: 1}})
