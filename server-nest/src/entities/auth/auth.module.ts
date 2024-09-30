import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ConfigService } from '@nestjs/config';
import { Role, RoleSchema } from '../roles';
import { User, UserSchema } from '../users';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Role.name,
        schema: RoleSchema,
      },
    ]),
  ],

  controllers: [AuthController],
  providers: [ConfigService, AuthService],
  exports: [AuthService],
})
export class AuthModule {}
