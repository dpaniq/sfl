import {Request, Response, NextFunction} from 'express';
import {IRepository} from '../repositories';
import {User, Games} from '@db';
import {GamesRepository} from '../repositories/games.repository';

// Check this out 3
export class GamesController {
  private readonly _repository: IRepository<Games>;

  constructor() {
    this._repository = new GamesRepository();
  }

  public async getGames(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response> {
    return this._repository
      .findAll()
      .then((entities) => response.status(200).send(entities))
      .catch((error) => response.status(500).send({error: error}));
  }

  public async getGame(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response> {
    return this._repository
      .findOne(Number(request.params.id))
      .then((entities) => response.status(200).send(entities))
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
