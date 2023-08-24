// type TUser = {

// }

type TYears =
  | '2011'
  | '2012'
  | '2013'
  | '2014'
  | '2015'
  | '2016'
  | '2017'
  | '2018'
  | '2019'
  | '2020'
  | '2021'
  | '2022'
  | '2023';

type JSONNumber = number | null;

type TPlayerJson = {
  name: string;
  games: Maybe<number>;
  goals: Maybe<number>;
  passes: Maybe<number>;
  score: Maybe<number>;
  mvp: Maybe<boolean>;
};

type TSFLJson = {
  [key in TYears]: TPlayerJson[];
};

// Utils types
type Maybe<T> = T | null;
// type

type Paginate<T> = {
  data: T[];
  count: number;
};
