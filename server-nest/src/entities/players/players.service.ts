import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPlayer, Player } from './players.schema';

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

  async patch(id: string, player: Partial<IPlayer>): Promise<IPlayer | null> {
    try {
      await this.playerModel
        .updateOne({ _id: id }, { $set: { ...player } })
        .exec();
      return await this.playerModel.findById(id).exec();
    } catch (error) {
      return null;
    }
  }
}
