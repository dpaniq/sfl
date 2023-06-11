import { Response, Request } from 'express'
import { isSaturday, nextSaturday } from "date-fns"
import sflJSON from '../sources/sfl.json'
import { GamesMigration } from "../models/GamesMigration"

export const migrateGamesForYear = async (req: Request, res: Response): Promise<any> => {

  const gamesMigration = new GamesMigration()
  const result = gamesMigration.migrate(req.params.year)

  return res.status(200).json(result)
}