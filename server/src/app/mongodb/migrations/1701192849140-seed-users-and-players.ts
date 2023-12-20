import {MigrationInterface, QueryRunner, getRepository} from 'typeorm';
import {db} from '../../db/data-sources/sqlite';
import {User} from '@entities/user.entity';
import {Player} from '@entities/player.entity';

import userJson from '../entities/user.json';
import {Role} from '@entities/role.entity';

export class SeedUsersAndPlayers1701192849140 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const users = userJson.rows.map((u) => {
      const user = new User();
      user.email = u.email;
      user.password = u.password;

      user.roles = [new Role('user')];

      return user;
    });
    const savedUsers = await db.getRepository(User).save(users);

    savedUsers.forEach(async (user) => {
      const {nickname} = userJson.rows.find(({email}) => email === user.email)!;
      const player = new Player();
      player.id = user.id;
      player.nickname = nickname;

      await db.getRepository(Player).save(player);
    });

    // await db.getRepository(Player).save(
    //   users.map((user) => {
    //     const player = new Player();
    //     player.user_id = user.id;
    //     return player;
    //   }),
    // );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(`DROP TABLE "player"`, undefined);
  }
}
