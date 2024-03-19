import { Injectable } from '@nestjs/common';
import { Game, IGame } from './game.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class GamesService {
  constructor(
    @InjectModel(Game.name)
    private gameModel: Model<IGame>,
  ) {}

  async save(game: IGame) {
    console.log('BEFORE SAVE', JSON.stringify(game, null, 2));

    const saveGame = await this.gameModel.create(game);
  }
}
