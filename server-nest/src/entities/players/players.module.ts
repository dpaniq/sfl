import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users';
import { UsersService } from '../users/users.service';
import { PlayersController } from './players.controller';
import { Player, PlayerSchema } from './players.schema';
import { PlayersService } from './players.service';

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
    ]),
  ],
  controllers: [PlayersController],
  providers: [UsersService, PlayersService],
})
export class PlayersModule {}
