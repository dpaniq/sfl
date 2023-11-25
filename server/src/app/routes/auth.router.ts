import {Router} from 'express';
import {generateAccessToken, generateRefreshToken} from '@utils/jwt';
import {verify, sign} from 'jsonwebtoken';
import {ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET} from '@utils/jwt';
import {Repository} from 'typeorm';
import {db, User} from '@db';
import md5 from 'md5';
import {HTTP_STATUS} from '@constants';
import {addDays} from 'date-fns';
import * as dotenv from 'dotenv';
import {authMiddleware} from '../middlewares';
import {CLIENT_HOSTNAME} from '../../environment';

dotenv.config();

const router = Router();

router.post('/login', async (req, res) => {
  try {
    const {email, password} = req.body;

    // Authenticate the user (e.g., by checking username and password)
    const user = await db.getRepository(User).findOne({where: {email}});

    if (!user || user.password !== md5(password)) {
      return res
        .status(HTTP_STATUS.CLIENT_ERRORS_4XX.UNAUTHORIZED)
        .json({message: 'Authentication failed'});
    }

    // If authenticated, generate and send an access token and a refresh token
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      expires: addDays(new Date(), 1),
      sameSite: true,
    });

    res.json({accessToken});
  } catch (error) {
    res.status(HTTP_STATUS.SERVER_ERRORS_5XX.INTERNAL_SERVER_ERROR).json({message: 'Server error'});
  }
});

router.get('/logout', authMiddleware, async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res
        .status(HTTP_STATUS.CLIENT_ERRORS_4XX.UNAUTHORIZED)
        .json({message: 'Authentication failed or you are not signed in'});
    }

    // For clearing cookie: domain and path are required?
    /**
     * , {
      domain: `.${CLIENT_HOSTNAME}`,
      path: '/',
      httpOnly: true,
    }
     */
    res.clearCookie('refreshToken');

    res.sendStatus(HTTP_STATUS.SUCCESS_2XX.NO_CONTENT);
  } catch (error) {
    res.status(HTTP_STATUS.SERVER_ERRORS_5XX.INTERNAL_SERVER_ERROR).json({message: 'Server error'});
  }
});

router.get('/refresh-token', (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  try {
    if (!refreshToken) {
      return res.sendStatus(HTTP_STATUS.CLIENT_ERRORS_4XX.UNAUTHORIZED);
    }

    const user = verify(refreshToken, REFRESH_TOKEN_SECRET!);

    console.log('access_token_expires', process.env.ACESSS_TOKEN_EXPIRES);
    const accessToken = sign({email: (user as any)?.email}, ACCESS_TOKEN_SECRET!, {
      expiresIn: process.env.ACESSS_TOKEN_EXPIRES,
    });

    res.json({accessToken});
  } catch (err) {
    res.sendStatus(HTTP_STATUS.CLIENT_ERRORS_4XX.FORBIDDEN); // Invalid refresh token
  }
});

export default router;
