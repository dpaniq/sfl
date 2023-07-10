import {START_SEASON_AT} from '@root/constants';
import {MigrationInterface, QueryRunner, getRepository} from 'typeorm';
import {User} from '@entities/user.entity';
import {Games, Games2011} from '@entities/games.entity';
import sflJSON from '../../../assets/SFL (json-check-all).json';
import {isSaturday, nextSaturday} from 'date-fns';

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

export class GenerateAndSeedGamesTable1585862017522 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      makeGame('games2011') +
        makeGame('games2012') +
        makeGame('games2013') +
        makeGame('games2014') +
        makeGame('games2015') +
        makeGame('games2016') +
        makeGame('games2017') +
        makeGame('games2018') +
        makeGame('games2019') +
        makeGame('games2020') +
        makeGame('games2021') +
        makeGame('games2022') +
        makeGame('games2023'),
      undefined,
    );
    await this.seed();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "games2011"`, undefined);
    await queryRunner.query(`DROP TABLE "games2012"`, undefined);
    await queryRunner.query(`DROP TABLE "games2013"`, undefined);
    await queryRunner.query(`DROP TABLE "games2014"`, undefined);
    await queryRunner.query(`DROP TABLE "games2015"`, undefined);
    await queryRunner.query(`DROP TABLE "games2016"`, undefined);
    await queryRunner.query(`DROP TABLE "games2017"`, undefined);
    await queryRunner.query(`DROP TABLE "games2018"`, undefined);
    await queryRunner.query(`DROP TABLE "games2019"`, undefined);
    await queryRunner.query(`DROP TABLE "games2020"`, undefined);
    await queryRunner.query(`DROP TABLE "games2021"`, undefined);
    await queryRunner.query(`DROP TABLE "games2022"`, undefined);
    await queryRunner.query(`DROP TABLE "games2023"`, undefined);
  }

  private async seed(): Promise<void> {
    const games: GamesWithNoId[] = await this.getAllGames();
    await getRepository(Games2011).save(games);
  }

  private async getAllGames(): Promise<GamesWithNoId[]> {
    const year = 2011;
    const json = sflJSON as unknown as TSFLJson;

    const games: GamesWithNoId[] = [];
    const games2011 = json[2011];
    for (const player of games2011) {
      const user = await this.getUser(player.name);
      if (!user) {
        continue;
      }
      games.push(...(await this.getSeasonGame(year, user, player)));
    }

    return games;
  }

  private async getSeasonGame(
    year: number,
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
          passes: player.passes,
          mvp: player.mvp,
        });
        firstRecord = false;
      } else {
        games.push({
          event_day: dateGame,
          player_id: user.id,
          goals: null,
          passes: null,
          mvp: null,
        });
      }
      dateGame = nextSaturday(dateGame);
      leftGames--;
    } while (leftGames);
    return games;
  }

  private async getUser(nickname: string): Promise<User | undefined> {
    return await getRepository(User).findOne({
      where: {
        nickname,
      },
    });
  }
}
