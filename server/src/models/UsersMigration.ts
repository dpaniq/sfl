import { Users } from "./Users";
import { makeId } from "../utils/string";
import md5 from 'md5';

export class UsersMigration extends Users {
  constructor() {
    super()
  }
  // migrate(users: User[]) {
  //   for (const user of users) {
  //     console.log(user)

  //     // In the future
  //     // this.createUser()
  //   }
  // }


  public createMassUsers(users: string[]) {
    for (const nickname of users) {
      const email = makeId(5) + '@sfl.lv'
      const password = md5(makeId(10))
      this.createUser(nickname, email, password)
    }
  }
}
