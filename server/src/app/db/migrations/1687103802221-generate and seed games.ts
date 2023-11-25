import {START_SEASON_AT} from '@root/constants';
import {MigrationInterface, QueryRunner, getRepository} from 'typeorm';
import {User} from '@root/app/bd/entities/user.entity';
import {Games} from '@root/app/bd/entities/games.entity';
import sflJSON from '../../../assets/SFL (json-check-all).json';
import {isSaturday, nextSaturday} from 'date-fns';
import {range} from '@root/app/utils/array';
import {GamesRepository} from '@root/app/repositories/games.repository';
import {sleep} from '@root/app/utils/tool';

const gamesRepository = new GamesRepository();

type GamesWithNoId = Omit<Games, 'id'>;

const makeGame = (tableName: string): string =>
  `CREATE TABLE IF NOT EXISTS ${tableName} (
  event_day DATE NOT NULL,
  player_id INTEGER NOT NULL,
  goals SMALLINT,
  passes SMALLINT,
  mvp BOOLEAN,
  FOREIGN KEY(player_id) REFERENCES users(id)
);`;

export class GenerateAndSeedGamesTable1685862017522 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(makeGame('games'), undefined);
    await this.seed();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "games"`, undefined);
  }

  private async seed(): Promise<void> {
    await this.getAllGames();
  }

  private async getAllGames(): Promise<void> {
    for (const year of [
      2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023,
    ]) {
      const games = await this.getGamesByYear(year as unknown as keyof TSFLJson);
      gamesRepository.use.save(games);
      console.log('sleep');
      await sleep(500);
    }
  }

  private async getGamesByYear(year: keyof TSFLJson): Promise<GamesWithNoId[]> {
    const json = sflJSON as unknown as TSFLJson;
    const users = await this.getUsers();

    const games: GamesWithNoId[] = [];
    for (const player of json[year]) {
      const user = users?.find((user) => user.nickname === player.name);
      if (!user) {
        continue;
      }
      games.push(...(await this.getSeasonGame(year, user, player)));
    }

    return games;
  }

  private async getSeasonGame(
    year: keyof TSFLJson,
    user: User,
    player: TPlayerJson,
  ): Promise<GamesWithNoId[]> {
    const games: GamesWithNoId[] = [];
    const startSeason = new Date(`${year}-${START_SEASON_AT}`);

    const initialSaturday = isSaturday(startSeason) ? startSeason : nextSaturday(startSeason);

    if (!player.games) {
      return [];
    }

    let leftGames = player.games;
    let dateGame = initialSaturday;
    let firstRecord = true;
    do {
      if (firstRecord) {
        games.push({
          event_day: dateGame,
          player_id: user.id,
          goals: player.goals,
          head_goals: null,
          passes: player.passes,
          mvp: player.mvp,
          capitan: null,
        });
        firstRecord = false;
      } else {
        games.push({
          event_day: dateGame,
          player_id: user.id,
          goals: null,
          head_goals: null,
          passes: null,
          mvp: null,
          capitan: null,
        });
      }
      dateGame = nextSaturday(dateGame);
      leftGames--;
    } while (leftGames);
    return games;
  }

  private async getUsers(): Promise<User[] | undefined> {
    return await getRepository(User).find();
  }
}
