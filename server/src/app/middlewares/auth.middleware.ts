import {Request, Response, NextFunction} from 'express';
import {verify} from 'jsonwebtoken';

import {ACCESS_TOKEN_SECRET} from '@utils/jwt';
import {Repository} from 'typeorm';

import {db, User} from '@db';
import {UserModel} from '@models';
import {HTTP_STATUS} from '../constants';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const accessToken = authHeader && authHeader.split(' ')[1];
  const refreshToken = req.cookies.refreshToken;

  req.cookies;
  console.log('at authmiddlaware', {
    accessToken,
    refreshToken,
    others: req.cookies,
    other2: req.headers.cookies,
  });

  if (!accessToken || !refreshToken)
    return res.sendStatus(HTTP_STATUS.CLIENT_ERRORS_4XX.UNAUTHORIZED);

  verify(accessToken, ACCESS_TOKEN_SECRET, async (err, payload) => {
    if (err) {
      return res.sendStatus(HTTP_STATUS.CLIENT_ERRORS_4XX.FORBIDDEN); // Token is not valid
    }

    if (typeof payload === 'object' && payload.email) {
      const repository: Repository<User> = db.getRepository(User);
      const user = await repository.findOne({where: {email: payload.email}});

      if (user) {
        req.user = new UserModel(user).getPublicData();
      }
    }
    next();
  });
}
