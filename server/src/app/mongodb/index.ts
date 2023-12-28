import {connect} from 'mongoose';
import {createCollections} from './utils/collection';

const MONGO_DB = 'mongodb://test_user:test_password@127.0.0.1:27017';
const MONGO_DB_DATABASE = 'test';

export const connectMongoDB = async (dbName: string = MONGO_DB_DATABASE) => {
  const client = await connect(MONGO_DB, {
    dbName,
  });

  return client;
};

export async function init() {
  await createCollections();

  return {success: true};
}
