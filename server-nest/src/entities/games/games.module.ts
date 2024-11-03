import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Player, PlayerSchema, PlayersService } from '../players';
import { PlayersModule } from '../players/players.module';
import { Game, GameSchema } from './game.schema';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';

@Module({
  imports: [
    forwardRef(() => PlayersModule),
    MongooseModule.forFeature([
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
  controllers: [GamesController],
  providers: [GamesService, PlayersService],
})
export class GamesModule {}
