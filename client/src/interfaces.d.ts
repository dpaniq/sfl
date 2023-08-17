interface IUser {
  id: number;
  nickname: string;
  email: string;
  name?: string;
  surname?: string;
  age?: number;
}

interface IPlayer extends IUser {}
