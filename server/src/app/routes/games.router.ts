import express, {NextFunction, Request, Response, Router} from 'express';
import {GamesController} from '../controllers/games.controller';

const router: Router = express.Router();

router.get('/', async (request: Request, response: Response, next: NextFunction) => {
  console.log('asdasdasdasas12313123');
  const controller: GamesController = new GamesController();
  // await controller.getGames(request, response, next);
});

router.get('/:id', async (request: Request, response: Response, next: NextFunction) => {
  const controller: GamesController = new GamesController();
  // await controller.getGame(request, response, next);
});

export const gamesRouter: Router = router;
