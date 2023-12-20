import {connect} from 'mongoose';
import {createCollections} from './utils/collection';

const MONGO_DB = 'mongodb://root:example@127.0.0.1:27017';
const MONGO_DB_DATABASE = 'test';

export const connectMongoDB = async (database: string = MONGO_DB_DATABASE) => {
  const client = await connect(MONGO_DB, {
    dbName: database,
  });

  return client;
};

export async function init() {
  await createCollections();

  return {success: true};
}
