import { Router } from "express"
import sflJSON from '../sources/sfl.json'
import { range } from "../utils/common"
import { add, isSaturday, nextSaturday, previousSaturday, startOfWeek } from "date-fns"

const router: Router = Router()



router.get('/migration/:year', (req, res) => {
  console.log(req.params)
  console.log(req.query)
  const { year } = req.params

  const startSeason = new Date(`${year}-12-01`)
  const initialSaturday = isSaturday(startSeason)
    ? startSeason
    : nextSaturday(startSeason)


  const games: { [key: string]: Player } = sflJSON[year]

  if (games) {
    for (const [name, player] of Object.entries(games)) {
      // for (const game in range(player.games)) {
      //   console.log()
      // }
      let leftGames = player.games
      let dateGame = initialSaturday
      do {

        console.log(`${name} played on ${dateGame}`)


        dateGame = previousSaturday(dateGame)
        leftGames--;

      } while (leftGames)

      break
    }
  }



  console.log(startSeason)
  console.log(year)

  new Date()

  res.status(200).json(sflJSON[year])
})

// router

export default router