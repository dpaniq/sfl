import mongoose, {Schema, model} from 'mongoose';
import {connectMongoDB} from '..';
import {UserSchema, UserModel, EnumUserCollection} from './user.model';
import {EnumRole, EnumRoleCollection, RoleModel, RoleSchema} from './role.model';
import {useRoleModelReference} from '../utils/refs';
import {createRole, createUser} from '../utils/creators';

let db: typeof mongoose;

let UserTestSchema: typeof UserSchema;
let UserModelTest: typeof UserModel;

// Reference
let RoleTestSchema: typeof RoleSchema;
let RoleModelTest: typeof RoleModel;

beforeAll(async () => {
  db = await connectMongoDB();

  // Reference
  RoleTestSchema = await RoleSchema.clone();
  RoleTestSchema.set('collection', EnumRoleCollection.Test);
  RoleModelTest = model(EnumRoleCollection.Test, RoleTestSchema);

  UserTestSchema = await UserSchema.clone();
  // UserTestSchema.pre('find', function (next) {
  //   this.populate('roles');
  //   next();
  // });
  UserTestSchema.set('collection', EnumUserCollection.Test);
  UserTestSchema.add({roles: useRoleModelReference(EnumRoleCollection.Test, RoleModelTest)});
  UserModelTest = model(EnumUserCollection.Test, UserTestSchema);

  // To work with empty collection
  await RoleModelTest.collection.drop();
  await RoleModelTest.createCollection();

  await UserModelTest.collection.drop();
  await UserModelTest.createCollection();
});

describe('Test team model', () => {
  test('should throw erorr', async () => {
    UserModelTest.create({}).catch((e: Error) => expect(e.name).toBe('ValidationError'));

    UserModelTest.create({email: 'email'}).catch((e: Error) =>
      expect(e.name).toBe('ValidationError'),
    );

    // Reference
    UserModelTest.create({email: 'email', password: 'password'}).catch((e: Error) => {
      expect(e.name).toBe('ValidationError');
      expect(e.message).toMatch(/At least one role is required/);
    });

    const roles = [{_id: new mongoose.Types.ObjectId(), name: 'unexistent'}];
    await UserModelTest.create({email: 'email', password: 'password', roles}).catch((e: Error) => {
      expect(e.name).toBe('ValidationError');
      expect(e.message).toMatch(/At least one role is required/);
    });
  });

  test("should validate user's email is unique", async () => {
    const role = await createRole(RoleModelTest, {name: EnumRole.Guest});
    await UserModelTest.create({email: 'email@email.lv', password: 'password', roles: [role]});
    await UserModelTest.create({
      email: 'email@email.lv',
      password: 'password',
      roles: [role],
    }).catch((e: Error) => {
      expect(e.name).toBe('MongoServerError');
      expect(e.message).toMatch(/duplicate key error/);
    });
  });

  test('should create user documents', async () => {
    await UserModelTest.collection.drop();
    const roles = await Promise.all([
      createRole(RoleModelTest, {name: EnumRole.Admin}),
      createRole(RoleModelTest, {name: EnumRole.QA}),
    ]);

    const user = await createUser(UserModelTest, {
      _id: '500f31ae-6f7e-4407-a19f-a87d65b8a00d' as unknown as Schema.Types.UUID,
      email: 'user@unique.lv',
      roles,
    });

    expect(mongoose.Types.UUID.isValid(user._id as any)).toBe(true);
    expect(!!user.password).toBe(true);
    expect(user.email).toBe('user@unique.lv');
    expect(user.roles).toHaveLength(2);
  });
});

afterAll(async () => {
  // To clear it from db
  // await UserModelTest.collection.drop();
  // await UserModelTest.collection.drop();
  await db.connection.close();
});
