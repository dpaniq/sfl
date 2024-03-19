import { Injectable } from '@nestjs/common';
import { IPlayer, Player } from './players.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel(Player.name)
    private playerModel: Model<IPlayer>,
  ) {}

  async find(): Promise<IPlayer[]> {
    return await this.playerModel.find().exec();
  }

  async findCaptains(): Promise<IPlayer[]> {
    return this.playerModel.find({ isCaptain: true }).exec();
  }
}
