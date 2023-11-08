import {Request, Response, NextFunction} from 'express';
import {verify} from 'jsonwebtoken';

export function verifyAccessTokenMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  verify(token, process.env.ACCESS_TOKEN_SECRET ?? 'ABC', (err, user) => {
    if (err) return res.sendStatus(403); // Token is not valid
    // req.user = user;
    next();
  });
}
