import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player, ServerPlayer } from './players.schema';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel(Player.name)
    private playerModel: Model<ServerPlayer>,
  ) {}

  async find(): Promise<ServerPlayer[]> {
    // const x = await this.playerModel.find({ nickname: 'Богдан' });
    // const xx = await x.populate('user');

    return await this.playerModel
      .find({
        // _id: '658ddee2f71a72e6d8ea9698',
      })
      .populate('user')
      .exec();
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
}
