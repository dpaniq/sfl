import express, {NextFunction, Request, Response, Router} from 'express';
import {UsersController} from '../controllers';
import {IUser} from '../mongodb/model/user.model';

const router: Router = express.Router();
const controller: UsersController = new UsersController();

// const expressCallback((request: Request, response: Response, next: NextFunction) => ({}))

router.get('/', async (request: Request, response: Response, next: NextFunction) => {
  // await controller.getAllUsers(request, response, next);
  console.log('here');
  response.send('ok');
});

router.get('/list', async (request: Request, response: Response, next: NextFunction) => {
  // await controller.getUsersList(request, response, next);
});

router.get('/m-seeds', async (request: Request, response: Response, next: NextFunction) => {
  await controller.seedUsers({response});
});

export const usersRouter: Router = router;
