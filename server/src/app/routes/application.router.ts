import express, {Router} from 'express';
import {gamesRouter} from './games.router';
import {playersRouter} from './players.router';
import {usersRouter} from './users.router';

const routers: Router = express.Router();
routers.use('/users', usersRouter);
routers.use('/games', gamesRouter);
routers.use('/players', playersRouter);

const appRouter: Router = express.Router();
appRouter.use('/api', routers);

export const applicationRouter: Router = appRouter;
