import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Player, PlayerSchema, PlayersService } from '../players';
import { Game, GameSchema } from './game.schema';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Game.name,
        schema: GameSchema,
      },
      {
        name: Player.name,
        schema: PlayerSchema,
      },
    ]),
  ],
  controllers: [GamesController],
  providers: [GamesService, PlayersService],
})
export class GamesModule {}
