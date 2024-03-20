import { ConflictException, Injectable } from '@nestjs/common';
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
}
