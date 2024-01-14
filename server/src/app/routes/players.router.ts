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
  '/list',
  async (request: Request, response: Response, next: NextFunction) => {
    controller.getList({request, response});
  },
);

router.patch(
  '/:id',
  async (request: Request, response: Response, next: NextFunction) => {
    const {id} = request.params;
    const player = request.body;

    console.log({id, player});

    const patchedPlayer = await controller.patch(id, player);
    console.log({patchedPlayer});
    response.json(patchedPlayer);
  },
);

router.post(
  '/captains',
  async (request: Request, response: Response, next: NextFunction) => {
    // const controller = new PlayersController();
    // await controller.getList(request, response, next);
    controller.getCaptains({request, response});
  },
);

export const playersRouter: Router = router;
