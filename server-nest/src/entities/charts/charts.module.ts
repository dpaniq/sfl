import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from '../games';
import { Player, PlayerSchema, PlayersService } from '../players';
import { User, UserSchema } from '../users';
import { UsersService } from '../users/users.service';
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
  providers: [UsersService, PlayersService, ChartsService],
})
export class ChartsModule {}
