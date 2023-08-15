export interface IRepository<T> {
  findAll(): Promise<T[]>;
  findOne(id: string): Promise<T | undefined>;
  findAllPagination(queryParams: {
    take?: number;
    skip?: number;
    searchQuery?: string;
  }): Promise<Paginate<T>>;
}
