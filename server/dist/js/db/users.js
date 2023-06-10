"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CREATE_TABLE_USERS = void 0;
exports.CREATE_TABLE_USERS = `
  CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT, 
    surname TEXT,
    nickname TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  );
`;
