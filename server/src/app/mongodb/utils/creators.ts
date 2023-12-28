import {GameModel, IGame, IGameGoal, IGamePlayer} from '../model/game.model';
import {EnumPlayerPosition, EnumPlayerStatus, IPlayer, PlayerModel} from '../model/player.model';
import {EnumRole, IRole, RoleModel} from '../model/role.model';
import {ITeam, TeamModel} from '../model/team.model';
import {IUser, IUserPublic, UserModel} from '../model/user.model';

export const createTeam = async (model: typeof TeamModel, fields: ITeam): Promise<ITeam> =>
  await model.create({
    ...fields,
  });

export const createRole = async (model: typeof RoleModel, fields: IRole): Promise<IRole> =>
  await model.create({
    ...fields,
  });

export const createUser = async (
  model: typeof UserModel,
  fields: IUser | IUserPublic,
): Promise<IUser> =>
  await model.create({
    ...fields,
  });

export const createPlayer = async (model: typeof PlayerModel, fields: IPlayer): Promise<IPlayer> =>
  await model.create({
    ...fields,
  });

export const createGame = async (model: typeof GameModel, fields: IGame): Promise<IGame> =>
  await model.create({
    ...fields,
  });
