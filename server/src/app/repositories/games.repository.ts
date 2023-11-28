import {db, Games} from '@db';
import {Like, Repository} from 'typeorm';
import {IRepository} from './repository.interface';

export class GamesRepository implements IRepository<Games> {
  #repository: Repository<Games> = db.getRepository(Games);

  get use(): Repository<Games> {
    return this.#repository;
  }

  public async findAll(): Promise<Games[]> {
    return this.#repository.find();
  }

  public async findOne(id: number): Promise<Games | null> {
    return this.#repository.findOne({where: {id}});
  }

  public async findAllPagination({
    take,
    skip,
    searchQuery,
  }: {
    take?: number;
    skip?: number;
    searchQuery?: string;
  }): Promise<Paginate<Games>> {
    const qtake = take || 10;
    const qskip = skip || 0;
    const qkeyword = searchQuery || '';

    const where = searchQuery ? {where: {nickname: Like('%' + qkeyword + '%')}} : {};

    const [result, total] = await this.#repository.findAndCount({
      // ...where, // TODO
      order: {asCaptain: 'ASC'},
      take: qtake,
      skip: qskip,
    });

    return {
      data: result,
      count: total,
    };
  }
}
