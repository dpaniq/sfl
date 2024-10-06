import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Game, IGame } from './game.schema';

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

  async findById(_id: string) {
    return await this.gameModel.findById({ _id });
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
    const replacedGame = await this.gameModel
      .findOneAndReplace({ _id }, game)
      .exec();

    console.log('replacedGame', replacedGame);

    if (!replacedGame) {
      throw BadRequestException;
    }

    return replacedGame;
  }

  async delete(_id: string) {
    const game = await this.gameModel.findOneAndDelete({ _id }).exec();

    console.log('delete game', game);

    if (!game) {
      throw BadRequestException;
    }

    return !!game;
  }
}
