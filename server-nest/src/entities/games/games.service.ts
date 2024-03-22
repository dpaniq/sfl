import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Game, IGame } from './game.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class GamesService {
  constructor(
    @InjectModel(Game.name)
    private gameModel: Model<IGame>,
  ) {}

  async find(game: Partial<IGame>) {
    console.log('find', game);
    return await this.gameModel.find({ ...game });
  }

  async save(game: IGame) {
    if (
      await this.gameModel.findOne({
        number: game.number,
        season: game.season,
      })
    ) {
      throw ConflictException;
    }

    return await this.gameModel.create(game);
  }

  async replace(_id: string, game: IGame) {
    const replacedGame = await this.gameModel.findOneAndReplace({ _id }, game);

    if (!replacedGame) {
      throw BadRequestException;
    }

    return replacedGame;
  }
}
