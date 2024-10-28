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

  public async calculatePlayersMetadata(game: IGame): Promise<any> {
    // Helpers
    const playersIds = game.statistics.map((stat) => stat.playerId);

    // Previous metadata to recalculate
    const players = (
      await this.playerModel.find({ _id: { $in: playersIds } }).exec()
    ).map((player) => player.toJSON());

    // Todo: this might be slow, probably need to optimize
    game.statistics.forEach(async (stat) => {
      const player = players.find((p) => p.id === stat.playerId);

      const { metadata } = player;

      const totalPasses = stat.pass;
      const totalGoalsByLeg = stat.goal;
      const totalGoalsByHead = stat.goalHead;
      const totalGoalsByPenalty = stat.penalty;
      const totalGoalsByAuto = 0;

      const currentGameMetada = {
        totalPasses,
        totalGoalsByLeg,
        totalGoalsByHead,
        totalGoalsByPenalty,
        totalGoalsByAuto,
      };

      // TODO: need structure like
      // metadata[games][season][#]
      const allGamesMetadata = Object.values(metadata.games).reduce(
        (curr, next) => {
          const totalPasses = stat.pass;
          const totalGoalsByLeg = stat.goal;
          const totalGoalsByHead = stat.goalHead;
          const totalGoalsByPenalty = stat.penalty;
          const totalGoalsByAuto = 0;

          curr.totalPasses += totalPasses;
          curr.totalGoalsByLeg += totalGoalsByLeg;
          curr.totalGoalsByHead += totalGoalsByHead;
          curr.totalGoalsByPenalty += totalGoalsByPenalty;
          curr.totalGoalsByAuto += totalGoalsByAuto;

          return curr;
        },
        {
          totalPasses: 0,
          totalGoalsByLeg: 0,
          totalGoalsByHead: 0,
          totalGoalsByPenalty: 0,
          totalGoalsByAuto: 0,
        },
      );
    });

    // Common

    const metadata: TPlayerMetadata | any = {
      [game.season]: {},
      // totalGames: number;
      // totalWonGames: number;
      // totalDraws: number;
      // totalLostGames: number;
      // totalPlayedAsTransfer: number;
      // totalPlayedAsCaptain: number;
      // totalPlayedAsFirstDraft: number;
      // totalPlayedAsSecondDraft: number;

      // gamesIds: string[];
      // gameResults: [boolean];
      // gameMaxWinGameStreak: number;
      // gameMaxLostGameStreak: number;
      // /**
      //  * List of games where the player served as captain.
      //  *
      //  * Example:
      //  * [
      //  *   gameId-1, // Game ID 1 where the player was captain
      //  *   gameId-n  // Game ID n where the player was captain
      //  * ]
      //  */
      // captained: string[];
      // /**
      //  * Captained by statistics: Count of how many times each player was under the captaincy.
      //  *
      //  * Example:
      //  * [
      //  *   playerId-1,
      //  *   playerId-n,
      //  * ]
      //  */
      // captainedBy: string[];
      // ancientRatingSystem: IAncientRatingSystem;
      // positionalRatingSystem: IPositionalRatingSystem;
    };

    return metadata;
  }
}
