import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from './config/configuration';
import { AuthModule } from './entities/auth';
import { AuthController } from './entities/auth/auth.controller';
import { GamesModule } from './entities/games/games.module';
import { PlayersModule } from './entities/players/players.module';
import { TeamsModule } from './entities/teams/teams.module';
import {
  User,
  UserSchema,
  UsersController,
  UsersModule,
} from './entities/users';
import { UsersService } from './entities/users/users.service';
import { ContextInterceptor } from './shared/interceptors/context/context.interceptor';
import { JwtMiddleware } from './shared/middlewares/user/jwt.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: `${configService.getOrThrow<string>('DATABASE_URL')}/${configService.getOrThrow<string>('DATABASE_DB')}`,
      }),
      inject: [ConfigService],
    }),
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
    PlayersModule,
    GamesModule,
    TeamsModule,
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
