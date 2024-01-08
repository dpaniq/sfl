import fs from 'node:fs/promises';

import {format} from 'date-fns';
import {logger} from '../middlewares/logger.middleware';
import {UserModel} from '../mongodb/model/user.model';
import {ClientSession} from 'mongoose';

import {createRole, createUser} from '../mongodb/utils/creators';
import {EnumRole, RoleModel} from '../mongodb/model/role.model';
import {PlayerModel} from '../mongodb/model/player.model';
import {sleep} from '@utils/tool';
import * as _ from 'lodash';

import gamesJSON from '../mongodb/data/game.json';
import {GameModel} from '../mongodb/model/game.model';

export class GameMigrationService {
  #name = '[Game:migration]';

  private async seed(
    year: string,
  ): Promise<{success: number; failure: number[]}> {
    const failure: number[] = [];

    logger.info(`${this.#name}::seed has been started`);

    const gamesByYear = gamesJSON.rows.filter(({event_day}) =>
      (event_day as string).startsWith(year),
    );

    for (const [index, game] of gamesByYear.entries()) {
      try {
        await GameModel.create([
          {
            season: Number(year),
            goals: [],
            players: [],
            playedAt: new Date(game.event_day),
          },
        ]);
      } catch (error) {
        failure.push(game.id);
        logger.error('Error at game seed transactions:', error);
      }

      const total = await GameModel.countDocuments();

      console.log(`${total}/${gamesByYear.length} games`);
      await sleep(5);
    }

    const data = {
      success: await GameModel.countDocuments(),
      failure,
    };

    this.log(data);
    return data;
  }

  private async log(data: any) {
    try {
      await fs.writeFile(
        `${__dirname}/../migrations-log/game-migration-${format(
          new Date(),
          'yyyy-MM-dd',
        )}.json`,
        JSON.stringify(data),
      );
    } catch (err) {
      logger.error('Errors at saving user-migration service:', err);
    }
  }
}
