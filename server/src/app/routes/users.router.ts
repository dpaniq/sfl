import express, {NextFunction, Request, Response, Router} from 'express';
import {UsersController} from '../controllers';
import {IUser} from '../mongodb/model/user.model';

const router: Router = express.Router();
const controller: UsersController = new UsersController();

router.get('/', async (request: Request, response: Response, next: NextFunction) => {
  // await controller.getAllUsers(request, response, next);
});

router.get('/list', async (request: Request, response: Response, next: NextFunction) => {
  // await controller.getUsersList(request, response, next);
});

export const usersRouter: Router = router;
