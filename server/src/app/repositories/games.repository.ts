import {Games} from '@entities/games.entity';
import {getRepository, Like, Repository} from 'typeorm';
import {IRepository} from './repository.interface';

export class GamesRepository implements IRepository<Games> {
  #repository: Repository<Games> = getRepository(Games);

  get use(): Repository<Games> {
    return this.#repository;
  }

  public async findAll(): Promise<Games[]> {
    return this.#repository.find();
  }

  public async findOne(id: string): Promise<Games | undefined> {
    return this.#repository.findOne(id);
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
    const repository: Repository<Games> = getRepository(Games);

    const where = searchQuery ? {where: {nickname: Like('%' + qkeyword + '%')}} : {};

    const [result, total] = await repository.findAndCount({
      ...where,
      order: {capitan: 'ASC'},
      take: qtake,
      skip: qskip,
    });

    return {
      data: result,
      count: total,
    };
  }
}
