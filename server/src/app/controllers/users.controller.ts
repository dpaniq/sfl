import {NextFunction, Request, Response} from 'express';
import {User, Games} from '@db';
import {IRepository} from '../repositories';
import {isNumber} from '../utils/number';

export class UsersController {
  private readonly _repository: IRepository<User>;

  constructor(repository: IRepository<User>) {
    this._repository = repository;
  }

  public async getAllUsers(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response> {
    console.log('asdasdas');
    return this._repository
      .findAll()
      .then((users) => response.status(200).send(users))
      .catch((error) => response.status(500).send({error: error}));
  }

  public async getUsersList(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response> {
    console.log(request.query);

    const take = isNumber(request.query.take) ? Number(request.query.take) : undefined;
    const skip = isNumber(request.query.skip) ? Number(request.query.skip) : undefined;
    const searchQuery = request.query.searchQuery as string;

    console.log(take, skip, searchQuery);

    return this._repository
      .findAllPagination({take, skip, searchQuery})
      .then((users) => response.status(200).send(users))
      .catch((error) => response.status(500).send({error: error}));
  }

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
