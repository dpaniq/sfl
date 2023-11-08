import {User} from '../db';

export class UserModel {
  constructor(private _user: User) {}

  getPublicData(): Omit<User, 'password'> {
    return {
      id: this._user.id,
      nickname: this._user.nickname,
      email: this._user.email,
      name: this._user.name,
      surname: this._user.surname,
      age: this._user.age,
    };
  }
}
