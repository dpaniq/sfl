
type UserRequiredFields = {
  nickname: string,
  email: string,
  password: string,
}


type Player = {
  games: number,
  goals: number,
  passes: number,
  score: number,
  mvp: number,
}

type Players = Player[]
