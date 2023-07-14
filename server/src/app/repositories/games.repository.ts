import {getRepository, Repository} from 'typeorm';
import {IRepository} from './repository.interface';
import {Games} from '@entities/games.entity';

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
}
