import 'reflect-metadata';
import {Application} from './app';
import * as dotenv from 'dotenv';
import {connectMongoDB} from './app/mongodb';

dotenv.config();

// Init database, then run app
connectMongoDB()
  .then(async () => {
    const application: Application = new Application();
    application.startServer();
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
