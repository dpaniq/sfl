import express, {NextFunction, Request, Response, Router} from 'express';
import {GamesController} from '../controllers/games.controller';
const controller: GamesController = new GamesController();
const router: Router = express.Router();

router.get(
  '/',
  async (request: Request, response: Response, next: NextFunction) => {
    console.log('asdasdasdasas12313123');
    const controller: GamesController = new GamesController();
    // await controller.getGames(request, response, next);
  },
);

router.get(
  '/:id',
  async (request: Request, response: Response, next: NextFunction) => {
    const controller: GamesController = new GamesController();
    // await controller.getGame(request, response, next);
  },
);

// router.get(
//   '/migration/seed/:year',
//   async (request: Request, response: Response, next: NextFunction) => {
//     const controller: GamesController = new GamesController();
//     return controller.seed({request, response});
//   },
// );

router.post(
  '/game',
  // TODO
  async (request: Request, response: Response, next: NextFunction) => {
    return await controller.create({request, response});
  },
);

export const gamesRouter: Router = router;
