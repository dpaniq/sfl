export interface IRepository<T> {
  findOne(id: number): Promise<T | null>;
  findAll(): Promise<T[]>;
  findAllPagination(queryParams: {
    take?: number;
    skip?: number;
    searchQuery?: string;
  }): Promise<Paginate<T>>;
}
