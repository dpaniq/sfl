import {Request, Response, NextFunction} from 'express';
import {IRepository} from '../repositories';
import {User} from '../data';

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
    return this._repository
      .findAll()
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
