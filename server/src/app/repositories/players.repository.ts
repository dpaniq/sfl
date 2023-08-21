import {getRepository} from 'typeorm';
import {User} from '../data';
import {BaseRepository} from './base.repository';

export class PlayersRepository extends BaseRepository<User> {
  _r = getRepository(User);

  // public async findAll(): Promise<User[]> {
  //   const repository: Repository<User> = getRepository(User);
  //   return repository.find();
  // }
  // public async findOne(id: string): Promise<User | undefined> {
  //   const repository: Repository<User> = getRepository(User);
  //   return repository.findOne(id);
  // }
  // public async findAllPagination({
  //   take,
  //   skip,
  //   searchQuery,
  // }: {
  //   take?: number;
  //   skip?: number;
  //   searchQuery?: string;
  // }): Promise<Paginate<User>> {
  //   const qtake = take || 10;
  //   const qskip = skip || 0;
  //   const qkeyword = searchQuery || '';
  //   const repository: Repository<User> = getRepository(User);
  //   const where = searchQuery ? {where: {nickname: Like('%' + qkeyword + '%')}} : {};
  //   const [result, total] = await repository.findAndCount({
  //     ...where,
  //     order: {nickname: 'ASC'},
  //     take: qtake,
  //     skip: qskip,
  //   });
  //   return {
  //     data: result,
  //     count: total,
  //   };
  // }
}
