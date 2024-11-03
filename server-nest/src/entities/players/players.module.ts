import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from '../games';
import { User, UserSchema } from '../users';
import { UsersService } from '../users/users.service';
import { PlayersController } from './players.controller';
import { Player, PlayerSchema } from './players.schema';
import { PlayersService } from './players.service';
import { GamesModule } from '../games/games.module';

@Module({
  imports: [
    forwardRef(() => GamesModule),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Player.name,
        schema: PlayerSchema,
      },
      {
        name: Game.name,
        schema: GameSchema,
      },
    ]),
  ],
  controllers: [PlayersController],
  providers: [UsersService, PlayersService],
})
export class PlayersModule {}
