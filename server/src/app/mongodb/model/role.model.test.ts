import mongoose, {Schema, model} from 'mongoose';
import {connectMongoDB} from '..';
import {EnumRole, EnumRoleCollection, RoleModel, RoleSchema} from './role.model';

let db: typeof mongoose;
let TestSchema: typeof RoleSchema;
let TestModel: typeof RoleModel;

beforeAll(async () => {
  db = await connectMongoDB();

  TestSchema = await RoleSchema.clone();
  TestSchema.set('collection', EnumRoleCollection.Test);
  TestModel = model(EnumRoleCollection.Test, TestSchema);

  // To work with empty collection
  await TestModel.collection.drop();
  await TestModel.createCollection();
});

describe('Test role model', () => {
  test('should throw erorr', async () => {
    TestModel.create({}).catch((e: Error) => expect(e.message).toMatch(/Path `name` is required/));

    TestModel.create({
      name: 'NO_EXISTENT_ROLE',
    }).catch((e: Error) =>
      expect(e.message).toMatch(/`NO_EXISTENT_ROLE` is not a valid enum value for path `name`./),
    );
  });

  test('should create role docs', async () => {
    const admin = await TestModel.create({
      name: EnumRole.Admin,
    });

    expect(admin.name).toBe(EnumRole.Admin);

    const geust = await TestModel.create({
      name: EnumRole.Guest,
      description: 'description',
    });

    expect(geust.name).toBe(EnumRole.Guest);
    expect(geust.description).toBe('description');
  });
});

afterAll(async () => {
  // To clear it from db
  await TestModel.collection.drop();
  await db.connection.close();
});
