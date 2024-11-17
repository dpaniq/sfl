import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'node:path';
import configuration from './config/configuration';
import { AuthModule } from './entities/auth';
import { AuthController } from './entities/auth/auth.controller';
import { ChartsModule } from './entities/charts/charts.module';
import { GamesModule } from './entities/games/games.module';
import { MigrationsController } from './entities/migrations/migrations.controller';
import { MigrationsModule } from './entities/migrations/migrations.module';
import { PlayersModule } from './entities/players/players.module';
import { RolesModule } from './entities/roles/roles.module';
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
import { FileLoggerService } from './shared/services/logger.service';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ConfigModule.forRoot({
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const mongodb = `${configService.getOrThrow<string>('DATABASE_URL')}/${configService.getOrThrow<string>('DATABASE_DB')}`;

        console.log('Connecting to the database:\n', mongodb);

        return {
          uri: mongodb,
        };
      },
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
    RolesModule,
    UsersModule,
    PlayersModule,
    GamesModule,
    TeamsModule,
    ChartsModule,
    MigrationsModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ContextInterceptor,
    },
    UsersService,
    FileLoggerService,
  ],
  exports: [FileLoggerService],
})
export class AppModule {
  // Set middlawares

  // TODO https://chatgpt.com/c/6739ae2b-49dc-8012-b665-536aa9e4b893
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .exclude('auth/sign-in', 'auth/sign-out')
      .forRoutes(AuthController, UsersController, MigrationsController);
  }
}
