import { Schema } from 'mongoose';

const MONGO_DB = 'mongodb://test_user:test_password@127.0.0.1:27017';
const MONGO_DB_DATABASE = 'test';
export const MONGO_DB_CONNECTION = `${MONGO_DB}/${MONGO_DB_DATABASE}`;

export const UUID = Schema.Types.UUID;
export const ObjectId = Schema.Types.ObjectId;
