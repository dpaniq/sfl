import { Database as DatabaseType } from "sqlite3";
import md5 from 'md5';
import sqlite3 from 'sqlite3'

// var sqlite3 = require('sqlite3').verbose()

const DBSOURCE = "db.sqlite"

export const Database: DatabaseType = new sqlite3.Database(DBSOURCE, (err: any) => {
  if (err) {
    // Cannot open database
    console.error(err.message)
    throw err
  }
});

// else {
//   console.log('Connected to the SQLite database.')
//   db.run(`CREATE TABLE user (
//           id INTEGER PRIMARY KEY AUTOINCREMENT,
//           name text, 
//           email text UNIQUE, 
//           password text, 
//           CONSTRAINT email_unique UNIQUE (email)
//           )`,
//     (err: any) => {
//       if (err) {
//         // Table already created
//         console.log('Table already created')
//       } else {
//         // Table just created, creating some rows
//         var insert = 'INSERT INTO user (name, email, password) VALUES (?,?,?)'
//         db.run(insert, ["admin", "admin@example.com", md5("admin123456")])
//         db.run(insert, ["user", "user@example.com", md5("user123456")])
//         db.run(insert, ["user2", "user2@example.com", md5("user2123456")])
//       }
//     });
// }
