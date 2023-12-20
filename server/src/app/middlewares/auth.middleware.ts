import {Request, Response, NextFunction} from 'express';
import {verify} from 'jsonwebtoken';

import {ACCESS_TOKEN_SECRET} from '@utils/jwt';
import {HTTP_STATUS} from '../constants';
import {UserModel} from '../mongodb/model/user.model';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const accessToken = authHeader && authHeader.split(' ')[1];
  const refreshToken = req.cookies.refreshToken;

  if (!accessToken || !refreshToken)
    return res.sendStatus(HTTP_STATUS.CLIENT_ERRORS_4XX.UNAUTHORIZED);

  verify(accessToken, ACCESS_TOKEN_SECRET, async (err, payload) => {
    if (err) {
      return res.sendStatus(HTTP_STATUS.CLIENT_ERRORS_4XX.FORBIDDEN); // Token is not valid
    }

    if (typeof payload === 'object' && payload.email) {
      const user = await UserModel.findOne({where: {email: payload.email}});

      if (user) {
        req.user = user;
      }
    }
    next();
  });
}
