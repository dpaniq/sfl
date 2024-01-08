import express, {NextFunction, Request, Response, Router} from 'express';
import {PlayersController} from '../controllers/players.controller';

const controller = new PlayersController();

const router: Router = express.Router();
// const usersRepository: IRepository<User> = new PlayersRepository(User);

// router.get('/', async (request: Request, response: Response, next: NextFunction) => {
//   const controller = new PlayersController();
//   await controller.findAll(request, response, next);
// });

// router.get(
//   '/list',
//   async (request: Request, response: Response, next: NextFunction) => {
//     // const controller = new PlayersController();
//     // await controller.getList(request, response, next);
//   },
// );

router.post(
  '/captains',
  async (request: Request, response: Response, next: NextFunction) => {
    // const controller = new PlayersController();
    // await controller.getList(request, response, next);
    controller.getCaptains({request, response});
  },
);

export const playersRouter: Router = router;
