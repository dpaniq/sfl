import mongoose, {connect, Schema} from 'mongoose';
import {MongoClient} from 'typeorm';
import {RoleModel} from './model/role.model';
import {TeamModel} from './model/team.model';
import {UserModel} from './model/user.model';
import {PlayerModel} from './model/player.model';
import {GameModel} from './model/game.model';
import {logger} from '../middlewares/logger.middleware';
import {createCollections} from './utils/collection';

const MONGO_DB = 'mongodb://root:example@127.0.0.1:27017';
const MONGO_DB_DATABASE = 'test';

export let mongodb: typeof mongoose;

export const connectMongoDB = async (database: string = MONGO_DB_DATABASE) => {
  const client = await connect(MONGO_DB, {
    dbName: database,
  });

  return client;

  // .then(
  //   async (client) => {
  //     await init();
  //     console.log('Connection with MongoDB estabilished');

  //     mongodb = client;
  //     return client;
  //   },
  //   (err) => {
  //     console.error('MongoDB crashed', err);
};

export async function init() {
  await createCollections();

  return {success: true};
}
