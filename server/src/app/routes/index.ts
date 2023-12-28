import express, {Router} from 'express';
import AuthRouter from './auth.router';
import SystemRouter from './system.router';
import {gamesRouter} from './games.router';
import {playersRouter} from './players.router';
import {usersRouter} from './users.router';

const systemRouter: Router = express.Router();
systemRouter.use('/system', SystemRouter);

const authRouter: Router = express.Router();
authRouter.use('/auth', AuthRouter);

const collectionRouters: Router = express.Router();
collectionRouters.use('/users', usersRouter);
collectionRouters.use('/games', gamesRouter);
collectionRouters.use('/players', playersRouter);

const apiRouter: Router = express.Router();
apiRouter.use('/rest', collectionRouters);

// Main router
const appRouter: Router = express.Router();
appRouter.use(systemRouter);
appRouter.use(authRouter);
appRouter.use(apiRouter);
export {appRouter};
