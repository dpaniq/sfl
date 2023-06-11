import { Games } from "./Games";
import sflJSON from '../sources/sfl.json'
import { range } from "../utils/common"
import { add, isSaturday, nextSaturday, previousSaturday, startOfWeek } from "date-fns"

export class GamesMigration extends Games {
  constructor() {
    super();
  }

  migrate(year: string) {

    if (Number(year) === new Date().getFullYear()) {
      return null
    }

    const games: { [key: string]: Player } = sflJSON[year]
    if (!games) {
      return null
    }

    const startSeason = new Date(`${year}-12-01`)
    const initialSaturday = isSaturday(startSeason)
      ? startSeason
      : nextSaturday(startSeason)




    for (const [name, player] of Object.entries(games)) {
      // for (const game in range(player.games)) {
      //   console.log()
      // }
      let leftGames = player.games
      let dateGame = initialSaturday
      do {

        console.log(`${name} played on ${dateGame}`)

        this.db.run()


        dateGame = nextSaturday(dateGame)
        leftGames--;

      } while (leftGames)

      break
    }



    console.log(startSeason)
    console.log(year)

    new Date()

    return { v: year }
  }
}