import express, {NextFunction, Request, Response, Router} from 'express';
import {UsersController} from '../controllers';
import {User} from '@db';
import {IRepository, UsersRepository} from '../repositories';

const router: Router = express.Router();
const usersRepository: IRepository<User> = new UsersRepository();
const controller: UsersController = new UsersController(usersRepository);

router.get('/', async (request: Request, response: Response, next: NextFunction) => {
  await controller.getAllUsers(request, response, next);
});

router.get('/list', async (request: Request, response: Response, next: NextFunction) => {
  await controller.getUsersList(request, response, next);
});

export const usersRouter: Router = router;
