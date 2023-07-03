import { getRepository, Repository } from 'typeorm';
import { IRepository } from './repository.interface';
import { Games, Games2011 } from '@entities/games.entity';

class Games2011Repository implements IRepository<Games> {
  public async findAll(): Promise<Games[]> {
    const repository: Repository<Games> = getRepository(Games2011);
    return repository.find();
  }

  public async findOne(id: string): Promise<Games | undefined> {
    const repository: Repository<Games> = getRepository(Games2011);
    return repository.findOne(id);
  }
}

export function gamesRepositoryFactory(year: number): IRepository<Games> | never {
  switch (year) {
    case 2011:
      return new Games2011Repository();
    default:
      throw new Error(`Games${year}Repository does not exist`);
  }
}

// export class Games2011Repository implements IRepository<Games> {
//   public async findAll(): Promise<Games[]> {
//     const repository: Repository<Games> = getRepository(Games2011);
//     return repository.find();
//   }
// }

// export class Games2011Repository implements IRepository<Games> {
//   public async findAll(): Promise<Games[]> {
//     const repository: Repository<Games> = getRepository(Games2011);
//     return repository.find();
//   }
// }

// export class Games2011Repository implements IRepository<Games> {
//   public async findAll(): Promise<Games[]> {
//     const repository: Repository<Games> = getRepository(Games2011);
//     return repository.find();
//   }
// }
