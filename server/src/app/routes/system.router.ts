import {Router} from 'express';
import {authMiddleware} from '@middlewares';
import {HTTP_STATUS} from '../constants';

const router = Router();

router.get('/ping', authMiddleware, async (req, res) => {
  if (req.user) {
    console.log(req.cookies);
    console.log(req.headers.location);
    return res.json(req.user);
  }
  return res.sendStatus(HTTP_STATUS.CLIENT_ERRORS_4XX.UNAUTHORIZED);
});

export default router;
