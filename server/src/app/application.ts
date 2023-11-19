import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import https from 'https';
import fs from 'fs';
import express, {Express} from 'express';
import {appRouter} from '@routes';
import {loggerMiddleware} from '@middlewares';
import path from 'path';
import * as env from '@env';
import {CORS_CONFIGURATION} from './config/cors';

export class Application {
  private _server: Express;

  constructor() {
    this._server = express();
    this._server.set('host', env.SERVER_HOSTNAME);
    this._server.set('port', env.SERVER_PORT);
    this._server.use(bodyParser.json());
    this._server.use(bodyParser.urlencoded({extended: true}));
    this._server.use(cookieParser());
    this._server.use(cors(CORS_CONFIGURATION));

    // Middlewares
    this._server.use(loggerMiddleware);

    this._server.use(appRouter);
  }

  public startServer(): void {
    let options = {};
    try {
      const keyPath = path.resolve(__dirname, '../../..', 'ssl', 'localhost.key');
      const certPath = path.resolve(__dirname, '../../..', 'ssl', 'localhost.crt');

      options = {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath),
      };
    } catch (error) {
      console.error('ssl connection error', error);
    }

    https.createServer(options, this._server).listen(env.SERVER_PORT, env.SERVER_HOSTNAME, () => {
      console.log(`Server works on https://${env.SERVER_HOSTNAME}:${env.SERVER_PORT}`);
    });
  }
}
