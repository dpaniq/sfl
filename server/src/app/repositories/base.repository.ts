import {
  EntityTarget,
  FindOneOptions,
  getConnectionManager,
  getRepository,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import {IRepository} from './repository.interface';

export abstract class BaseRepository<T extends ObjectLiteral> implements IRepository<T> {
  _r!: Repository<T>;

  public async findAll(): Promise<T[]> {
    // const repository: Repository<T> = getRepository(User);
    return this._r.find();
  }

  public async findOne(id: number): Promise<T | null> {
    return this._r.findOne({where: {id}} as any);
  }

  public async findAllPagination({
    take,
    skip,
    // searchQuery,
    where,
    order,
  }: {
    take?: number;
    skip?: number;
    searchQuery?: string;
    // where?: {where: {[prop in keyof T]: FindOperator<string>}}
    where?: {where: FindOneOptions<T>['where']};
    // order?: {order: }
    order?: {order: FindOneOptions<T>['order']};
  }): Promise<Paginate<T>> {
    const qtake = take || 10;
    const qskip = skip || 0;
    // const qkeyword = searchQuery || '';

    // const where = searchQuery ? {where: {nickname: Like('%' + qkeyword + '%')}} : {};

    console.log('FROM BASE REPOSITORY', this._r, {
      ...where,
      ...order,
      take: qtake,
      skip: qskip,
    });

    const [result, total] = await this._r.findAndCount({
      // ...where,
      ...order,
      ...where,
      take: qtake,
      skip: qskip,
    });

    return {
      data: result,
      count: total,
    };
  }
}
