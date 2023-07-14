import express, {Request, Response, Router, NextFunction} from 'express';
import {UsersController} from '../controllers';
import {IRepository, UsersRepository} from '../repositories';
import {User} from '../data';
import {GamesController} from '../controllers/games.controller';

const router: Router = express.Router();

router.get('/', async (request: Request, response: Response, next: NextFunction) => {
  const controller: GamesController = new GamesController();
  await controller.getGames(request, response, next);
});

router.get('/:id', async (request: Request, response: Response, next: NextFunction) => {
  const controller: GamesController = new GamesController();
  await controller.getGame(request, response, next);
});

export const gamesRouter: Router = router;
