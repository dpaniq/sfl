import express, { Request, Response, Router, NextFunction } from 'express';
import { UsersController } from '../controllers';
import { IRepository, UsersRepository } from '../repositories';
import { User } from '../data';
import { GamesController } from '../controllers/games.controller';
import { gamesRepositoryFactory } from '../repositories/games.repository';

const router: Router = express.Router();

router.get('/2011/', async (request: Request, response: Response, next: NextFunction) => {
  const controller: GamesController = new GamesController(2011);
  await controller.getGames(request, response, next);
});

router.get('/2011/:id', async (request: Request, response: Response, next: NextFunction) => {
  const controller: GamesController = new GamesController(2011);
  await controller.getGame(request, response, next);
});

export const gamesRouter: Router = router;
