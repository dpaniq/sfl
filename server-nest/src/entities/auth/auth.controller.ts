import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UsePipes,
} from '@nestjs/common';
import { ValibotValidationPipe } from 'src/shared/pipes/custom-pipe/valibot-validation.pipe';
import { AuthRequiredValiSchema } from './auth.dto';
import { ApiTags, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Auth } from './auth.schema';
import { hash } from 'src/shared/utils/string';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { addDays } from 'date-fns';
import { Request, Response } from 'express';
import { access } from 'fs';

@ApiBearerAuth()
@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {}

  @Get('whoami')
  whoami(@Req() req: Request) {
    return (req as any)?.user;
  }

  @Post('sign-in')
  @ApiBody({
    type: Auth,
    description: 'auth model',
    required: true,
  })
  @UsePipes(new ValibotValidationPipe(AuthRequiredValiSchema))
  async signIn(@Res() res: Response, @Body() auth: Auth) {
    console.log({ auth });

    const { accessToken, refreshToken } = await this.authService.signIn(auth);

    // Set cookie refreshToken
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      expires: addDays(new Date(), 1),
      sameSite: true,
    });

    // It makes header Content-Type: application/json
    return res.json({ accessToken });
  }

  @Post('sign-out')
  @ApiResponse({
    status: 200,
    description: 'sign out (reset tokens)',
  })
  signOut(@Res() res: Response) {
    res.cookie('refreshToken', null, {
      httpOnly: true,
      expires: new Date(),
      sameSite: true,
    });

    // It makes header Content-Type: application/json
    return res.json({ accessToken: null });
  }
}
