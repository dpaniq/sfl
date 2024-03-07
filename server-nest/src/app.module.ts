import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { MONGO_DB_CONNECTION } from './constants';
import { AuthModule } from './entities/auth';
import {
  User,
  UserSchema,
  UsersController,
  UsersModule,
} from './entities/users';
import { JwtMiddleware } from './shared/middlewares/user/jwt.middleware';
import configuration from './config/configuration';
import { AuthController } from './entities/auth/auth.controller';
import { UsersService } from './entities/users/users.service';
import { ContextInterceptor } from './shared/interceptors/context/context.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    MongooseModule.forRoot(MONGO_DB_CONNECTION),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    JwtModule.register({
      // TODO: add secrets 100%
      // TODO: add public & private keys (why, optional)
      global: true,
      signOptions: {
        algorithm: 'HS512',
      },
    }),
    AuthModule,
    UsersModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ContextInterceptor,
    },
    UsersService,
  ],
})
export class AppModule {
  // Set middlawares
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .exclude('auth/sign-in', 'auth/sign-out')
      .forRoutes(AuthController, UsersController);
  }
}
