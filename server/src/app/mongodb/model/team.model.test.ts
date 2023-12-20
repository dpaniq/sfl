import mongoose, {Schema, model} from 'mongoose';
import {TeamSchema, TeamModel, EnumTeamColor, EnumTeamCollection} from './team.model';
import {connectMongoDB} from '..';
import {createTeam} from '../utils/creators';

let db: typeof mongoose;
let TestSchema: typeof TeamSchema;
let TestModel: typeof TeamModel;

beforeAll(async () => {
  db = await connectMongoDB();

  TestSchema = await TeamSchema.clone();
  TestSchema.set('collection', EnumTeamCollection.Test);
  TestModel = model(EnumTeamCollection.Test, TestSchema);

  // To work with empty collection
  await TestModel.collection.drop();
  await TestModel.createCollection();
});

describe('Test team model', () => {
  test('should throw erorr', async () => {
    TestModel.create({}).catch((e: Error) => expect(e.name).toMatch('ValidationError'));

    TestModel.create({name: 'BMW', description: 'description', color: 'BAD_COLOR'}).catch(
      (e: Error) => expect(e.message).toMatch(/is not a valid enum value/),
    );
  });

  test('should create team documents', async () => {
    const team = await createTeam(TestModel, {
      name: 'name',
      description: 'description',
      color: EnumTeamColor.Red,
    });

    expect(team.name).toBe('name');
    expect(team.description).toBe('description');
    expect(team.color).toBe(EnumTeamColor.Red);
  });
});

afterAll(async () => {
  // To clear it from db
  await TestModel.collection.drop();
  await db.connection.close();
});
