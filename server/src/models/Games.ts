import { Database } from "sqlite3";

import { Database as DB } from '../db'

export class Games {
  readonly db: Database = DB

  constructor() { }
}