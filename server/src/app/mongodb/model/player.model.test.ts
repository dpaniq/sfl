import {expect, jest, test} from '@jest/globals';

import mongoose, {Schema, model, Document} from 'mongoose';
import {connectMongoDB} from '..';
import {UserSchema, UserModel, EnumUserCollection, IUser} from './user.model';
import {EnumRole, EnumRoleCollection, IRole, RoleModel, RoleSchema} from './role.model';
import {
  EnumPlayerCollection,
  EnumPlayerPosition,
  EnumPlayerStatus,
  PlayerModel,
  PlayerSchema,
} from './player.model';
import {useRoleModelReference, useUserModelReference} from '../utils/refs';
import {createPlayer, createRole, createUser} from '../utils/creators';

let db: typeof mongoose;

let PlayerSchemaTest: typeof PlayerSchema;
let PlayerModelTest: typeof PlayerModel;

// References
let UserSchemaTest: typeof UserSchema;
let UserModelTest: typeof UserModel;

let RoleSchemaTest: typeof RoleSchema;
let RoleModelTest: typeof RoleModel;

beforeAll(async () => {
  db = await connectMongoDB();

  // Reference
  RoleSchemaTest = await RoleSchema.clone();
  RoleSchemaTest.set('collection', EnumRoleCollection.Test);
  RoleModelTest = model(EnumRoleCollection.Test, RoleSchemaTest);

  UserSchemaTest = await UserSchema.clone();
  UserSchemaTest.set('collection', EnumUserCollection.Test);
  UserSchemaTest.add({roles: useRoleModelReference(EnumRoleCollection.Test, RoleModelTest)});
  UserModelTest = model(EnumUserCollection.Test, UserSchemaTest);

  // Original
  PlayerSchemaTest = await PlayerSchema.clone();
  PlayerSchemaTest.set('collection', EnumPlayerCollection.Test);
  PlayerSchemaTest.add({userId: useUserModelReference(EnumUserCollection.Test, UserModelTest)});
  PlayerModelTest = model(EnumPlayerCollection.Test, PlayerSchemaTest);

  // To work with empty collection
  await RoleModelTest.collection.drop();
  await RoleModelTest.createCollection();

  await UserModelTest.collection.drop();
  await UserModelTest.createCollection();

  await PlayerModelTest.collection.drop();
  await PlayerModelTest.createCollection();
});

describe('Test player model', () => {
  test('should throw erorr', async () => {
    await PlayerModelTest.create({}).catch((e: Error) => {
      expect(e.name).toBe('ValidationError');
      expect(e.message).toMatch('`userId` is required');
    });

    // Create user, clone and than remove to throw error
    const role = await createRole(RoleModelTest);
    const user = await createUser([role], UserModelTest);
    await UserModelTest.findOneAndDelete({email: user.email});
    await PlayerModelTest.create({userId: user}).catch((e: Error) => {
      expect(e.name).toBe('ValidationError');
      expect(e.message).toMatch('No user is found');
    });
  });

  test('should create user documents', async () => {
    const roles = await Promise.all([
      createRole(RoleModelTest, {name: EnumRole.Admin}),
      createRole(RoleModelTest, {name: EnumRole.QA}),
    ]);

    const user = await createUser(roles, UserModelTest, {email: 'email@unique.lv'});
    const player = await createPlayer(user, PlayerModelTest, {
      nickname: 'nickname',
      status: EnumPlayerStatus.Active,
      position: EnumPlayerPosition.DefenderCenter,
    });

    expect(player.nickname).toBe('nickname');
    expect(player.isCaptain).toBe(false);
    expect(player.status).toBe(EnumPlayerStatus.Active);
    expect(player.position).toBe(EnumPlayerPosition.DefenderCenter);
  });
});

afterAll(async () => {
  // To clear it from db
  await RoleModelTest.collection.drop();
  await UserModelTest.collection.drop();
  await PlayerModelTest.collection.drop();
  await db.connection.close();
});
