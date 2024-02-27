import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ValibotValidationPipe } from 'src/shared/pipes/custom-pipe/valibot-validation.pipe';
import { AuthRequiredValiSchema } from './auth.dto';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { AuthModel } from './auth.model';
import { hash } from 'src/shared/utils/string';
import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UsePipes(new ValibotValidationPipe(AuthRequiredValiSchema))
  @ApiBody({
    type: AuthModel,
    description: 'auth model',
    required: true,
  })
  async login(@Body() auth: AuthModel) {
    console.log(auth);

    const users = await this.authService.getsUsers();
    console.log(users);

    // const user = await this.authService.validateUser(
    //   loginDto.username,
    //   loginDto.password,
    // );

    // if (!user) {
    //   throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    // }

    // const payload = { username: user.username, sub: user.userId };
    // const accessToken = this.jwtService.sign(payload);

    const accessToken = hash('asdasd');

    return { access_token: accessToken, users };
  }
}
