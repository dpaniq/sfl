import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IGame } from '../games/game.schema';
import { Player, ServerPlayer, TPlayerMetadata } from './players.schema';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel(Player.name)
    private playerModel: Model<ServerPlayer>,
  ) {}

  async findById(id: string): Promise<ServerPlayer> {
    return (
      await this.playerModel.findById(id).populate('user').exec()
    ).toJSON();
  }

  async find(): Promise<ServerPlayer[]> {
    return await this.playerModel.find({}).populate('user').exec();
  }

  async findCaptains(): Promise<ServerPlayer[]> {
    return await this.playerModel
      .find({ isCaptain: true })
      .populate('user')
      .exec();
  }

  async patch(
    id: string,
    player: Partial<ServerPlayer>,
  ): Promise<ServerPlayer | null> {
    try {
      await this.playerModel
        .findByIdAndUpdate({ _id: id }, { $set: { ...player } })
        .exec();
      return await this.playerModel.findById(id).populate('user').exec();
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async create(player: {
    nickname: string;
    userId: string;
    number: number;
  }): Promise<any> {
    try {
      const { id } = await this.playerModel.create({
        nickname: player.nickname,
        user: player.userId,
        number: player.number,
      });

      return await this.playerModel.findById(id).populate('user').exec();
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async delete(id: string): Promise<ServerPlayer | null> {
    try {
      return await this.playerModel.findByIdAndDelete({ _id: id }).exec();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  public async calculateMetadata(game: IGame): Promise<{}> {
    const metadata: TPlayerMetadata | any = {};

    return metadata;
  }
}
