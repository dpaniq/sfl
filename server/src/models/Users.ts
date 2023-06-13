import { Database } from "sqlite3";
import { createUser, getUserById } from "../db/users";
import md5 from 'md5'
import { makeId } from "../utils/string";

export class Users {
  constructor() { }

  protected getUserById(id: number) {
    const user = getUserById(id)
    console.log({ user })

    if (Object.keys(user).length === 0) {
      throw new Error('User was not found').message
    }

    return user
  }

  protected createUser(nickname: string, email: string, password: string) {
    createUser(nickname, email, password)
  }

  private priveteVioletta() { }
}