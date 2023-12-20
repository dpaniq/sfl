import {NextFunction, Request, Response} from 'express';
import {isNumber} from '../utils/number';
import {HTTP_STATUS} from '../constants/http';

export class UsersController {
  // private readonly _repository = db.getRepository(User);
  // public async getAllUsers(
  //   request: Request,
  //   response: Response,
  //   next: NextFunction,
  // ): Promise<Response> {
  //   console.log('asdasdas');
  //   return this._repository
  //     .find()
  //     .then((users) => response.status(200).send(users))
  //     .catch((error) => response.status(500).send({error: error}));
  // }
  // public async getUsersList(
  //   request: Request,
  //   response: Response,
  //   next: NextFunction,
  // ): Promise<Response> {
  //   console.log(request.query);
  //   const take = isNumber(request.query.take) ? Number(request.query.take) : undefined;
  //   const skip = isNumber(request.query.skip) ? Number(request.query.skip) : undefined;
  //   const searchQuery = request.query.searchQuery as string;
  //   console.log(take, skip, searchQuery);
  //   return response.status(HTTP_STATUS.SUCCESS_2XX.NO_CONTENT);
  //   // return db.getRepository(User)
  //   //   .findAllPagination({take, skip, searchQuery})
  //   //   .then((users) => response.status(200).send(users))
  //   //   .catch((error) => response.status(500).send({error: error}));
  // }
  // public async getUserList(request: Request, response: Response, next: NextFunction): Promise<any> {
  //   const names = new Set();
  //   const json = sflJSON as unknown as TSFLJson;
  //   for (const year of Object.keys(json)) {
  //     for (const player of sflJSON[year as TYears]) {
  //       names.add(player.name);
  //     }
  //   }
  //   return response.send(Array.from(names).sort());
  // }
}
