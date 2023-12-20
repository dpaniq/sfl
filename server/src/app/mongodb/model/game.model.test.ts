import {expect, jest, test} from '@jest/globals';

import mongoose, {Schema, model, Document, Model} from 'mongoose';
import {connectMongoDB} from '..';
import {EnumTeamCollection, EnumTeamColor, TeamModel, TeamSchema} from './team.model';
import {UserSchema, UserModel, EnumUserCollection, IUser} from './user.model';
import {EnumRole, EnumRoleCollection, IRole, RoleModel, RoleSchema} from './role.model';
import {
  EnumPlayerCollection,
  EnumPlayerPosition,
  EnumPlayerStatus,
  PlayerModel,
  PlayerSchema,
} from './player.model';
import {
  usePlayerModelReference,
  useRoleModelReference,
  useTeamModelReference,
  useUserModelReference,
} from '../utils/refs';
import {createGame, createPlayer, createRole, createTeam, createUser} from '../utils/creators';
import {
  EnumGameCollection,
  GameModel,
  GameSchema,
  GameGoalSchema,
  GamePlayerSchema,
  IGameGoal,
  IGamePlayer,
  EnumGameGoalCollection,
  EnumGamePlayerCollection,
  IGame,
} from './game.model';

let db: typeof mongoose;

let TeamSchemaTest: typeof TeamSchema;
let TeamModelTest: typeof TeamModel;

let UserSchemaTest: typeof UserSchema;
let UserModelTest: typeof UserModel;

let RoleSchemaTest: typeof RoleSchema;
let RoleModelTest: typeof RoleModel;

let PlayerSchemaTest: typeof PlayerSchema;
let PlayerModelTest: typeof PlayerModel;

let GameGoalSchemaTest: Schema<IGameGoal>;
let GameGoalModelTest: Model<IGameGoal>;

let GamePlayerSchemaTest: Schema<IGamePlayer>;
let GamePlayerModelTest: Model<IGamePlayer>;

let GameSchemaTest: typeof GameSchema;
let GameModelTest: typeof GameModel;

beforeAll(async () => {
  db = await connectMongoDB();

  // Reference
  TeamSchemaTest = await TeamSchema.clone();
  TeamSchemaTest.set('collection', EnumTeamCollection.Test);
  TeamModelTest = model(EnumTeamCollection.Test, TeamSchemaTest);

  // Todo: is set collection needed?
  RoleSchemaTest = await RoleSchema.clone();
  RoleSchemaTest.set('collection', EnumRoleCollection.Test);
  RoleModelTest = model(EnumRoleCollection.Test, RoleSchemaTest);

  UserSchemaTest = await UserSchema.clone();
  UserSchemaTest.set('collection', EnumUserCollection.Test);
  UserSchemaTest.add({roles: useRoleModelReference(EnumRoleCollection.Test, RoleModelTest)});
  UserModelTest = model(EnumUserCollection.Test, UserSchemaTest);

  PlayerSchemaTest = await PlayerSchema.clone();
  PlayerSchemaTest.set('collection', EnumPlayerCollection.Test);
  PlayerSchemaTest.add({userId: useUserModelReference(EnumUserCollection.Test, UserModelTest)});
  PlayerModelTest = model(EnumPlayerCollection.Test, PlayerSchemaTest);

  // Game
  GameGoalSchemaTest = new Schema<IGameGoal>(
    {
      match: {
        type: Number,
        required: true,
      },
      teamId: useTeamModelReference(EnumTeamCollection.Test, TeamModelTest),
      goal: usePlayerModelReference(EnumPlayerCollection.Test, PlayerModelTest, false),
      goalHead: usePlayerModelReference(EnumPlayerCollection.Test, PlayerModelTest, false),
      pass3: usePlayerModelReference(EnumPlayerCollection.Test, PlayerModelTest, false),
      pass2: usePlayerModelReference(EnumPlayerCollection.Test, PlayerModelTest, false),
      pass1: usePlayerModelReference(EnumPlayerCollection.Test, PlayerModelTest, false),
    },
    {_id: false},
  );

  GamePlayerSchemaTest = new Schema<IGamePlayer>(
    {
      playerId: usePlayerModelReference(EnumPlayerCollection.Test, PlayerModelTest),
      teamId: useTeamModelReference(EnumTeamCollection.Test, TeamModelTest),
      position: {type: String, enum: EnumPlayerPosition},
      distance: Number,
      pulse: Number,
      injure: Boolean,
    },
    {_id: false},
  );

  GameSchemaTest = new Schema<IGame>(
    {
      season: {
        type: Number,
        required: true,
        index: true,
      },
      goals: [GameGoalSchemaTest],
      players: [GamePlayerSchemaTest],
      playedAt: {type: Date, required: true},
    },
    {
      timestamps: true,
      versionKey: '_gen',
    },
  );
  GameSchemaTest.set('collection', EnumGameCollection.Test);

  GameGoalModelTest = model(EnumGameGoalCollection.Test, GameGoalSchemaTest);
  GamePlayerModelTest = model(EnumGamePlayerCollection.Test, GamePlayerSchemaTest);
  GameModelTest = model(EnumGameCollection.Test, GameSchemaTest);

  // To work with empty collection
  await TeamModelTest.collection.drop();
  await TeamModelTest.createCollection();

  await RoleModelTest.collection.drop();
  await RoleModelTest.createCollection();

  await UserModelTest.collection.drop();
  await UserModelTest.createCollection();

  await PlayerModelTest.collection.drop();
  await PlayerModelTest.createCollection();

  await GameGoalModelTest.collection.drop();
  await GamePlayerModelTest.collection.drop();

  await GameModelTest.collection.drop();
  await GameModelTest.createCollection();
});

describe('Test player model', () => {
  test('should create game documents', async () => {
    const roles = await Promise.all([
      createRole(RoleModelTest, {name: EnumRole.Admin}),
      createRole(RoleModelTest, {name: EnumRole.QA}),
    ]);

    const team1 = await createTeam(TeamModelTest, {
      name: 'Team1',
      color: EnumTeamColor.Red,
    });

    const team2 = await createTeam(TeamModelTest, {
      name: 'Team2',
      color: EnumTeamColor.White,
    });

    const user = await createUser(UserModelTest, {
      _id: '500f31ae-6f7e-1107-a19f-a87d65b8a00d' as unknown as Schema.Types.UUID,
      email: 'email1@unique.lv',
      roles,
    });

    const user2 = await createUser(UserModelTest, {
      _id: '500f31ae-6f7e-2207-a19f-a87d65b8a00d' as unknown as Schema.Types.UUID,
      email: 'email2@unique.lv',
      roles,
    });

    const player1 = await createPlayer(PlayerModelTest, {
      nickname: 'nickname',
      status: EnumPlayerStatus.Active,
      position: EnumPlayerPosition.DefenderCenter,
      userId: user,
    });

    const player2 = await createPlayer(PlayerModelTest, {
      nickname: 'nickname2',
      status: EnumPlayerStatus.Active,
      position: EnumPlayerPosition.DefenderCenter,
      userId: user2,
    });

    const game = await createGame(GameModelTest, {
      season: 12,
      goals: [
        new GameGoalModelTest({
          teamId: team1,
          goal: player1,
          match: 1,
        }),
        new GameGoalModelTest({
          teamId: team1,
          goal: player2,
          match: 2,
        }),
      ],
      players: [
        new GamePlayerModelTest({
          mvp: true,
          playerId: player1,
          teamId: team1,
        }),
        new GamePlayerModelTest({
          mvp: true,
          playerId: player2,
          teamId: team1,
          injure: true,
          pulse: 170,
        }),
      ],
      playedAt: new Date(),
    });

    expect(game.season).toBe(12);
    expect(game.goals).toBeInstanceOf(Array);
    expect(game.players).toBeInstanceOf(Array);
  });
});

afterAll(async () => {
  // To clear it from db
  await TeamModelTest.collection.drop();
  await RoleModelTest.collection.drop();
  await UserModelTest.collection.drop();
  await PlayerModelTest.collection.drop();
  await GameModelTest.collection.drop();
  await db.connection.close();
});
