import ky from 'ky';

const HOSTNAME = 'http://localhost:3001';
const PLAYERS_ROOT = HOSTNAME + '/api/players';

type PlayersListResponse = {
  data: IPlayer[];
  count: number;
};

export const getPlayersList = async ({
  take,
  skip,
  searchQuery,
}: {
  take: number;
  skip: number;
  searchQuery?: string;
}): Promise<PlayersListResponse> =>
  await ky
    .get(`${PLAYERS_ROOT}/list`, {
      searchParams: {
        take,
        skip,
        searchQuery,
      },
    })
    .json<PlayersListResponse>()
    .catch((e) => {
      console.log(e);
      return {
        data: [],
        count: 0,
      };
    });
