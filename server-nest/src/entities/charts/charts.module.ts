import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from '../games';
import { Player, PlayerSchema } from '../players';
import { User, UserSchema } from '../users';
import { ChartsController } from './charts.controller';
import { ChartsService } from './charts.service';

@Module({
  imports: [
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
  controllers: [ChartsController],
  providers: [ChartsService],
})
export class ChartsModule {}
