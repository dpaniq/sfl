export class User {
  constructor(
    public id: number,
    public nickname: string,
    public email: string,
    public password: string,
    public name?: string,
    public surname?: string,
    public age?: number,
  ) { }
}
