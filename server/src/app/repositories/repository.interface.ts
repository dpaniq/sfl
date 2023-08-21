export interface IRepository<T> {
  findOne(id: string): Promise<T | undefined>;
  findAll(): Promise<T[]>;
  findAllPagination(queryParams: {
    take?: number;
    skip?: number;
    searchQuery?: string;
  }): Promise<Paginate<T>>;
}
