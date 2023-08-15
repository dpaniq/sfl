import express, {NextFunction, Request, Response, Router} from 'express';
import {PlayersController} from '../controllers/players.controller';
import {User} from '../data';
import {IRepository, UsersRepository} from '../repositories';

const router: Router = express.Router();
const usersRepository: IRepository<User> = new UsersRepository();
const controller = new PlayersController(usersRepository);

router.get('/', async (request: Request, response: Response, next: NextFunction) => {
  console.log('asdasdas');
  // await controller.findAll(request, response, next);
});

// router.get('/list', async (request: Request, response: Response, next: NextFunction) => {
//   console.log('jhere');
//   await controller.getUsersList(request, response, next);
// });

export const playersRouter: Router = router;
