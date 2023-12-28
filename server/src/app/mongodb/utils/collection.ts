import {RoleModel} from '../model/role.model';
import {TeamModel} from '../model/team.model';
import {PlayerModel} from '../model/player.model';
import {GameModel} from '../model/game.model';
import {UserModel} from '../model/user.model';
import {logger} from 'src/app/middlewares/logger.middleware';

export async function createCollections() {
  try {
    RoleModel.createCollection();
    TeamModel.createCollection();
    UserModel.createCollection();
    PlayerModel.createCollection();
    GameModel.createCollection();

    logger.info('All collection prepared');
  } catch (error) {
    logger.error('Some collections crashed.\nDouble check here\n', error);
  }
}
