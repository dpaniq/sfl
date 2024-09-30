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
        .updateOne({ _id: id }, { $set: { ...player } })
        .exec();
      return await this.playerModel.findById(id).exec();
    } catch (error) {
      return null;
    }
  }

  async create(player: { nickname: string; userId: string }): Promise<any> {
    try {
      return await this.playerModel.create({
        nickname: player.nickname,
        user: player.userId,
      });
    } catch (error) {
      return null;
    }
  }
  // updateInfo(
  //   id: string,
  //   body: Partial<ClientPlayer>,
  // ): Promise<ServerPlayer | null> {
  //   const bodyPlayer: Partial<ServerPlayer> = { ...body };
  //   delete bodyPlayer.name;
  //   delete bodyPlayer.surname;

  //   const userBody: Partial<IUser> = {
  //     name: req.body.name,
  //     surname: req?.body.surname,
  //   };

  //   console.log(bodyPlayer, userBody);

  //   const player = await this.playersService.patch(req.params.id, bodyPlayer);

  //   return await usePlayerInfoTransaction();
  // }
}
