export interface IRepository<T> {
  findAll(): Promise<T[]>;
  findOne(id: string): Promise<T | undefined>;
}
