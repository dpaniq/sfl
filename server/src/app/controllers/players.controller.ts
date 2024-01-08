import {IControllerArgs} from '.';
import {PlayerModel} from '../mongodb/model/player.model';

export class PlayersController {
  public async getCaptains({request, response}: Omit<IControllerArgs, 'next'>) {
    const perPage = 10;

    const {page} = request.body;

    console.log(perPage, page);

    // Move to service
    const captains = await PlayerModel.find({isCaptain: true})
      .skip(page * perPage)
      .sort({nickname: 'asc'});

    response.json({
      captains,
      page: page + 1,
    });
  }

  // public async findAll(
  //   request: Request,
  //   response: Response,
  //   next: NextFunction,
  // ): Promise<Response> {
  //   console.log('asdasdas');
  //   console.log('asdasdas');
  //   console.log('asdasdas');
  //   console.log('asdasdas');
  //   console.log('asdasdas');
  //   console.log('asdasdas');
  //   return this._r
  //     .findAll()
  //     .then((users) => response.status(200).send(users))
  //     .catch((error) => response.status(500).send({error: error}));
  // }

  // public async getList(
  //   request: Request,
  //   response: Response,
  //   next: NextFunction,
  // ): Promise<Response> {
  //   const take = isNumber(request.query.take) ? Number(request.query.take) : undefined;
  //   const skip = isNumber(request.query.skip) ? Number(request.query.skip) : undefined;
  //   const searchQuery = request.query.searchQuery as string;
  //   console.log('1', take, skip, searchQuery);

  //   const where = searchQuery
  //     ? {
  //         where: [
  //           {
  //             nickname: Like('%' + searchQuery + '%'),
  //           },
  //           {
  //             email: Like('%' + searchQuery + '%'),
  //           },
  //         ],
  //       }
  //     : {where: undefined};

  //   return this._r
  //     .findAllPagination({take, skip, where})
  //     .then((users) => response.status(200).send(users))
  //     .catch((error) => response.status(500).send({error: error}));
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
