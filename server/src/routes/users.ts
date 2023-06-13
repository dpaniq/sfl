import { Router, Request, Response } from "express";
import { UsersMigration } from "../models/UsersMigration";
import sflJSON from '../sources/sfl.json';
import { getUsers } from '../db/users';
import { Users } from "../entity/Users";
import { AppDataSource } from "../data-source";

const router: Router = Router();

const userRepository = AppDataSource.getRepository(Users)





router.get('/api/user/:id', async (req: Request, res: Response) => {

  const { id } = req.params
  console.log('id', id)
  const user = await userRepository.findOne({ where: { id: Number(id) } })
  return res.status(200).json(user)
})

router.get('/api/users/all', async (req: Request, res: Response) => {
  const users = await userRepository.find()
  console.log(users)
  return res.status(200).json(users)
})

// router.get('/api/users/:id', (req: Request, res: Response) => {
//   const user = new Users()

//   return res.json(user.getUserById(Number(req.params.id)))
// })

router.get('/api/users/migration/:year', (req: Request, res: Response) => {

  const { year } = req.params

  const usersByYear = sflJSON[year] as { [key in string]: Player }
  if (!usersByYear) {
    res.json({ status: null })
    return
  }

  const usersToRegister = Object.keys(usersByYear)
  const usersMigration = new UsersMigration()
  usersMigration.createMassUsers(usersToRegister)
  res.json({ status: 'ok' })
})




// router.post('/api/users', (req: Request, res: Response) => {
//   const user = new Users()

//   return

// })


export default router