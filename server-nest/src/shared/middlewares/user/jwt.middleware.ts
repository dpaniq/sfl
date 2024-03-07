import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthService } from '../../../entities/auth/auth.service';
import { Request, Response } from 'express';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}

  async use(req: Request, res: Response, next: () => void) {
    const authHeader = req.headers.authorization;
    const accessToken = authHeader && authHeader.split(' ')[1];
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken && !refreshToken) {
      throw new UnauthorizedException();
    }

    const verifedAccess = await this.authService.verifyAccessToken(accessToken);
    if (verifedAccess) {
      (req as any).user = verifedAccess;
      (req as any).accessToken = accessToken;
      return next();
    }

    const verifedRefresh =
      await this.authService.verifyRefreshToken(refreshToken);
    if (verifedRefresh) {
      // Get user by refresh
      const user = await this.authService.getUser({
        email: verifedRefresh.email,
      });

      // Generate new access token
      const accessToken = await this.authService.generateAccessToken(user);

      // Add them to request
      (req as any).user = verifedRefresh;
      (req as any).accessToken = accessToken;
      return next();
    }

    throw new UnauthorizedException();
  }
}
