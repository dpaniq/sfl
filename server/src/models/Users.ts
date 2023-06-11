import { Database } from "sqlite3";
import { createUser, getUserById } from "../db/users";
import md5 from 'md5'
import { makeId } from "../utils/string";

export class Users {
  constructor() { }

  getUserById(id: number) {
    const user = getUserById(id)
    console.log({ user })

    if (Object.keys(user).length === 0) {
      throw new Error('User was not found').message
    }

    return user
  }

  createUser(nickname: string, email: string, password: string) {
    createUser(nickname, email, password)
  }

  createMassUsers(users: User[]) {
    for (const { nickname } of users) {
      const email = makeId(5) + '@sfl.lv'
      const password = md5(makeId(10))
      this.createUser(nickname, md5(makeId(10), md5(makeId(10)))
    }
  }
}