import ky from 'ky';

const HOSTNAME = 'http://localhost:3000';
const USERS_ROOT = HOSTNAME + '/users';

export const getUsersReq = async (): Promise<User[]> =>
  await ky
    .get(USERS_ROOT)
    .json<User[]>()
    .catch((e) => {
      console.log(e);
      return [] as User[];
    });
