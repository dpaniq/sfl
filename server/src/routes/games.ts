import { Router } from "express"
import { migrateGamesForYear } from "../controllers/games"


const router: Router = Router()



router.get('/api/games/migration/:year', migrateGamesForYear)

// router

export default router