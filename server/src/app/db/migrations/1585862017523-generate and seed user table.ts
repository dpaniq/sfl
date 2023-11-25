import md5 from 'md5';

import {MigrationInterface, QueryRunner, getRepository} from 'typeorm';
import {User} from '../entities/user.entity';

import sflJSON from '../../../assets/SFL (json-check-all).json';
import {makeRandomString} from '@utils/string';

export class GenerateAndSeedUserTable1585862017523 implements MigrationInterface {
  name = 'generateAndSeedUserTable1585862017523';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT, 
        surname TEXT,
        nickname TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        age TINYINT(2)
      );`,
      undefined,
    );
    await this.seed();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`, undefined);
  }

  private async seed(): Promise<void> {
    const users = this.getUsersFromJson();
    await getRepository(User).save(users);
  }

  private getUsersFromJson(): Omit<User, 'id' | 'name' | 'surname' | 'age'>[] {
    const names = new Set();
    const json = sflJSON as unknown as TSFLJson;
    for (const year of Object.keys(json)) {
      for (const player of sflJSON[year as TYears]) {
        names.add(player.name);
      }
    }
    return (Array.from(names).sort() as string[]).map((nickname) => ({
      nickname,
      email: makeRandomString(5) + '@sfl.lv',
      password: md5(makeRandomString(10)),
      // age: null,
      // name: null,
      // surname: null,
    }));
  }
}
