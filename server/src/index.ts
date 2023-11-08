import 'reflect-metadata';
import {Application} from './app';
import * as dotenv from 'dotenv';
import {db} from './app/db';

dotenv.config();

// Init database, then run app
db.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .then(async () => {
    const application: Application = new Application();
    application.startServer();
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
