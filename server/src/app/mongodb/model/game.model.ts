import {Schema, model, connect} from 'mongoose';
import {EnumTeamCollection, TeamModel} from './team.model';
import {EnumPlayerCollection, EnumPlayerPosition, PlayerModel} from './player.model';
import {usePlayerModelReference, useTeamModelReference} from '../utils/refs';

export interface IGamePlayer {
  playerId: Schema.Types.ObjectId;
  teamId: Schema.Types.ObjectId;

  distance?: number;
  position?: boolean;
  injure?: boolean;
  pulse?: number;
  mvp?: boolean;
}

export interface IGameGoal {
  match: number;
  teamId: Schema.Types.ObjectId;
  goal: Schema.Types.ObjectId;

  goalHead?: Schema.Types.ObjectId;
  pass1?: Schema.Types.ObjectId;
  pass2?: Schema.Types.ObjectId;
  pass3?: Schema.Types.ObjectId;
}

export interface IGame {
  season: number;
  goals: IGameGoal[];
  players: IGamePlayer[];
  playedAt: Date;
}

export enum EnumGameCollection {
  Game = 'games',
  Test = '_games_tests',
}

export enum EnumGameGoalCollection {
  Goal = 'game_goals',
  Test = '_game_goals_tests',
}

export enum EnumGamePlayerCollection {
  Player = 'game_players',
  Test = '_game_players_tests',
}

export const GameGoalSchema = new Schema<IGameGoal>(
  {
    match: {
      type: Number,
      required: true,
    },
    teamId: useTeamModelReference(EnumTeamCollection.Team, TeamModel),
    goal: usePlayerModelReference(EnumPlayerCollection.Player, PlayerModel, false),
    goalHead: usePlayerModelReference(EnumPlayerCollection.Player, PlayerModel, false),
    pass3: usePlayerModelReference(EnumPlayerCollection.Player, PlayerModel, false),
    pass2: usePlayerModelReference(EnumPlayerCollection.Player, PlayerModel, false),
    pass1: usePlayerModelReference(EnumPlayerCollection.Player, PlayerModel, false),
  },
  {_id: false},
);

export const GamePlayerSchema = new Schema<IGamePlayer>(
  {
    playerId: usePlayerModelReference(EnumPlayerCollection.Player, PlayerModel),
    teamId: useTeamModelReference(EnumTeamCollection.Team, TeamModel),
    position: {type: String, enum: EnumPlayerPosition},
    distance: Number,
    pulse: Number,
    injure: Boolean,
  },
  {_id: false},
);

export const GameSchema = new Schema<IGame>(
  {
    season: {type: Number, required: true, index: true},
    goals: [GameGoalSchema],
    players: [GamePlayerSchema],
    playedAt: {type: Date, required: true},
  },
  {
    timestamps: true,
    versionKey: '_gen',
  },
);

export const GameModel = model<IGame>(EnumGameCollection.Game, GameSchema);
