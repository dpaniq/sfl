import { Router, Request, Response } from "express";
import { Users } from "../models/Users";

const router: Router = Router()

router.get('/api/users/:id', (req: Request, res: Response) => {
  const user = new Users()

  return res.json(user.getUserById(Number(req.params.id)))
})

// router.post('/api/users', (req: Request, res: Response) => {
//   const user = new Users()

//   return

// })

export default router