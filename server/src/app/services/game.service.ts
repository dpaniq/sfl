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

import {
  GameModel,
  IGame,
  IGameGoal,
  IGamePlayer,
} from '../mongodb/model/game.model';

export class GameService {
  #name = '[Game:service]';

  public async create({
    season,
    playedAt,
    goals,
    players,
  }: IGame): Promise<IGame | null> {
    try {
      const [game] = await GameModel.create([
        {
          season: season,
          goals,
          players,
          playedAt,
        },
      ]);
      return game;
    } catch (error) {
      logger.error(`${this.#name} - create game error:\n`, error);
    }
    return null;
  }

  public async verified(id: string): Promise<boolean> {
    try {
      const game = await GameModel.findById(id);
      if (game) {
        GameModel.updateOne({id}, {verified: true});
        return true;
      }
      return false;
    } catch (error) {
      logger.error(`${this.#name} - verified game error:\n`, error);
    }
    return false;
  }
}
