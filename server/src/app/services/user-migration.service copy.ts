import fs from 'node:fs/promises';

import {format} from 'date-fns';
import {logger} from '../middlewares/logger.middleware';
import {UserModel} from '../mongodb/model/user.model';
import {ClientSession} from 'mongoose';

import userJSON from '../mongodb/data/user.json';
import {createRole, createUser} from '../mongodb/utils/creators';
import {EnumRole, RoleModel} from '../mongodb/model/role.model';
import {PlayerModel} from '../mongodb/model/player.model';
import {sleep} from '@utils/tool';

export class UserMigrationService {
  async seedUsersTransaction(): Promise<{success: number; failure: number[]}> {
    let failure: number[] = [];
    let session: ClientSession | null = null;

    // Todo: Check role = admin

    logger.info('User migration drop collection');
    UserModel.collection.drop();

    const role = await createRole(RoleModel, {name: EnumRole.User});
    // const role = await RoleModel.findOne({name: EnumRole.User}); //  (RoleModel, {name: EnumRole.User});

    await UserModel.createCollection();

    for (const user of userJSON.rows) {
      try {
        const userSaved = await UserModel.create([
          {
            email: user.email,
            password: user.password,
            roles: [role],
          },
        ]);

        await PlayerModel.create([
          {
            userId: userSaved[0],
            nickname: user.nickname,
          },
        ]);

        const total = await PlayerModel.countDocuments();

        console.log(`${total}/220 players`);
        await sleep(5);
      } catch (error) {
        failure.push(user.id);
        logger.error('Error at user seed transactions:', error);
        continue;
      }
    }

    const data = {
      success: await UserModel.countDocuments(),
      failure,
    };

    this.log(data);
    return data;
  }

  async seedUsersTransactionDraft(): Promise<{success: number; failure: number[]}> {
    let failure: number[] = [];
    let session: ClientSession | null = null;

    // Todo: Check role = admin

    logger.info('User migration drop collection');
    UserModel.collection.drop();

    // const role = await createRole(RoleModel, {name: EnumRole.User});
    const role = await RoleModel.findOne({name: EnumRole.User}); //  (RoleModel, {name: EnumRole.User});

    await UserModel.createCollection()
      .then(() => UserModel.startSession())
      // The `withTransaction()` function's first parameter is a function
      // that returns a promise.
      .then((_session) => {
        session = _session;
        return session.withTransaction(async () => {
          for (const user of userJSON.rows) {
            try {
              const userSaved = await UserModel.create(
                [
                  {
                    email: user.email,
                    password: user.password,
                    roles: [role],
                  },
                ],
                {session},
              );

              await PlayerModel.create(
                [
                  {
                    userId: userSaved,
                    nickname: user.nickname,
                  },
                ],
                {session},
              );

              const total = await PlayerModel.countDocuments({session});

              console.log(`${total}/220 players`);
              await sleep(5);
            } catch (error) {
              failure.push(user.id);
              logger.error('Error at user seed transactions:', error);
              continue;
            }
          }
          return Promise.resolve();
        });
      })
      .catch((error) => {
        logger.error('User seeds transaction error:\n', error);
      })
      .finally(() => {
        if (session) {
          session.commitTransaction();
          session.endSession();
        }
      });

    const data = {
      success: await UserModel.countDocuments(),
      failure,
    };

    this.log(data);
    return data;
  }

  private async log(data: any) {
    try {
      await fs.writeFile(
        `user-migration-${format(new Date(), 'yyyy-MM-dd')}.json`,
        JSON.stringify(data),
      );
    } catch (err) {
      logger.error('Errors at saving user-migration service:', err);
    }
  }
}
