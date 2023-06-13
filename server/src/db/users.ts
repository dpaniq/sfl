import { Database } from '../db'

export const CREATE_TABLE_USERS =
  `
  CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT, 
    surname TEXT,
    nickname TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  );
`


// function createUser(id: number, date: Date,) {
//   const query = 'INSERT INTO user (name, email, password) VALUES (?,?,?)'
//   return []
// }

export function getUsers() {
  return Database.run('SELECT * FROM users', (res) => {
    console.log({ res })
    return res
  })
}

export function getUserById(id: number) {
  return Database.run('SELECT * FROM users WHERE id = ? LIMIT 1', [id])
}



export function createUser(nickname: string, email: string, password: string) {

  Database.run('INSERT INTO users (nickname, email, password) VALUES (?,?,?)', [
    nickname,
    email,
    password,
  ]);
}
