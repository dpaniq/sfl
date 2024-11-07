import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Game, IGame } from '../games/game.schema';
import { Player } from '../players';

@Injectable()
export class ChartsService {
  constructor(
    @InjectModel(Player.name)
    private playerModel: Model<Player>,

    @InjectModel(Game.name)
    private gameModel: Model<IGame>,
  ) {}

  async top10AncientRatingSystemBySeason(season: number): Promise<
    {
      id: string;
      nickname: string;
      user: {
        name?: string;
        surname?: string;
        email?: string;
      };
      ancientRatingSystem: {
        plusMinus: number;
        lastResult: number;
        totalPoints: number;
      };
    }[]
  > {
    return await this.playerModel
      .aggregate(
        [
          {
            $match: {
              [`metadata.bySeason.${season}.ancientRatingSystem.totalPoints`]: {
                $exists: 1,
                $ne: null,
              },
            },
          },
          {
            $project: {
              _id: '$_id',
              id: '$_id',
              user: '$user',
              nickname: '$nickname',
              ancientRatingSystem: `$metadata.bySeason.${season}.ancientRatingSystem`,
            },
          },
          {
            $sort: {
              'ancientRatingSystem.totalPoints': -1,
            },
          },
          { $limit: 10 },
          {
            $lookup: {
              from: 'users',
              localField: 'user',
              foreignField: '_id',
              as: 'user',
            },
          },
          { $unwind: '$user' },
          {
            $unset: ['_id', 'user.password', 'user.roles'],
          },
        ],
        { maxTimeMS: 60000, allowDiskUse: true },
      )
      .exec();
  }
}
