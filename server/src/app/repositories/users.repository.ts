import {Like, Repository, Entity, FindOperator} from 'typeorm';
import {User, db} from '@db';
import {IRepository} from './repository.interface';

export class UsersRepository implements IRepository<User> {
  public async findAll(): Promise<User[]> {
    const repository: Repository<User> = db.getRepository(User);
    return repository.find();
  }

  public async findOne(id: string): Promise<User | null> {
    const repository: Repository<User> = db.getRepository(User);
    return repository.findOne({where: {id}});
  }

  // public async findAllPagination<T extends typeof Entity>(
  //   entity: T,
  //   {
  //     take,
  //     skip,
  //     searchQuery,
  //   }: {
  //     FindManyOptions<T>
  //     searchQuery?: string;
  //   },
  // ): Promise<Paginate<T>> {
  //   const qtake = take || 10;
  //   const qskip = skip || 0;
  //   const qkeyword = searchQuery || '';
  //   const repository: Repository<T> = db.getRepository(entity);

  //   const where = searchQuery ? {where: {email: Like('%' + qkeyword + '%')}} : {};

  //   const [result, total] = await repository.findAndCount({
  //     ...where,
  //     order: 'ASC',
  //     take: qtake,
  //     skip: qskip,
  //   });

  //   return {
  //     data: result,
  //     count: total,
  //   };
  // }
}
