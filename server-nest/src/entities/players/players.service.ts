import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FlattenMaps, Model, Types } from 'mongoose';
import {
  Game,
  IGame,
  IGameMetadata,
  IPlayerGameResultMetadata,
  PlayerStatistic,
} from '../games/game.schema';
import {
  IPlayerCommonTotalsMetadata,
  IPlayerMetadata,
  IPlayerMetadataByGame,
  METADATA_BY_GAME_DEFAULT,
  METADATA_COMMON_TOTALS_GAME_DEFAULT,
  METADATA_DEFAULT,
} from './constants/player-career-metadata';
import { Player, ServerPlayer } from './players.schema';
import { accumulatePlayerCareerMetadata } from './utils/player-career-metadata';
import { accumulatePlayerSeasonMetadata } from './utils/player-season-metadata';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel(Player.name)
    private playerModel: Model<Player>,

    @InjectModel(Game.name)
    private gameModel: Model<IGame>,
  ) {}

  async findById(id: string): Promise<ServerPlayer> {
    return (
      await this.playerModel.findById(id).populate('user').exec()
    ).toJSON();
  }

  async find({ ids }: { ids?: Types.ObjectId[] }): Promise<ServerPlayer[]> {
    return await this.playerModel
      .find({
        ...(ids ? { _id: { $in: ids } } : {}),
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
      console.error(error);
      return null;
    }
  }

  async create(player: {
    nickname: string;
    userId: Types.UUID;
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
      console.error(error);
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

  public async calculatePlayerGameResultMetadata(
    statistic: PlayerStatistic,
    game: WithId<IGame>,
  ): Promise<IPlayerGameResultMetadata> {
    console.log('calculatePlayerGameResultMetadata');

    let playerGameResultMetadata: IPlayerGameResultMetadata = {
      ...METADATA_BY_GAME_DEFAULT,
      ...METADATA_COMMON_TOTALS_GAME_DEFAULT,
      errors: [],
    };

    // Helpers
    const dateError = new Date();

    const gameSeason: number = game.season;
    const gameNumber: number = game.number;
    const gameMetadata: IGameMetadata = game.metadata;
    const seasonGameNumberKey: `${number}:${number}` = `${gameSeason}:${gameNumber}`;

    // Previous metadata to recalculate
    const player = await this.playerModel
      .findOne({ _id: statistic.playerId.toString() })
      .exec();

    // Todo: this might be slow, probably need to optimize

    try {
      const playerId = player.id.toString();

      if (!player) {
        throw new Error('Player is not found');
      }

      // TODO move to helpers
      const isTeamFromFirstDraftWon =
        gameMetadata.scoreFirstDraft > gameMetadata.scoreSecondDraft;
      const isTeamFromSecondDraftWon =
        gameMetadata.scoreFirstDraft < gameMetadata.scoreSecondDraft;

      const asFirstDraft =
        gameMetadata.playerIdsOfFirstDraft.includes(playerId);
      const asSecondDraft =
        gameMetadata.playerIdsOfSecondDraft.includes(playerId);

      const playerMetadataByGame: IPlayerMetadataByGame = {
        ...METADATA_BY_GAME_DEFAULT,

        isMvp: gameMetadata.mvpListIds.includes(playerId),
        isMvpByPasses: gameMetadata.mvpByPassesIds.includes(playerId),
        isMvpByGoals:
          gameMetadata.mvpByGoalsIds.includes(playerId) ||
          gameMetadata.mvpByGoalsHeadIds.includes(playerId),

        asCaptain: statistic.isCaptain,
        asFirstDraft,
        asSecondDraft,

        hasWon: asFirstDraft && isTeamFromFirstDraftWon,
        hasLose: asFirstDraft && isTeamFromSecondDraftWon,
        hasDraw: gameMetadata.scoreIsDraw,
      };

      const totalPasses = statistic.pass;
      const totalGoalsByLeg = statistic.goal;
      const totalGoalsByHead = statistic.goalHead;
      const totalGoalsByPenalty = statistic.penalty;
      const totalGoalsByAuto = 0;
      const totalGoals =
        totalGoalsByLeg + totalGoalsByHead + totalGoalsByPenalty;

      const playerCommonTotalsMetadata: IPlayerCommonTotalsMetadata = {
        totalPasses,
        totalGoalsByLeg,
        totalGoalsByHead,
        totalGoalsByPenalty,
        totalGoalsByAuto,
        totalGoals,
        totalPoints:
          totalGoalsByLeg +
          totalGoalsByHead +
          totalGoalsByPenalty +
          totalPasses,
      };

      playerGameResultMetadata = {
        ...playerGameResultMetadata,
        ...playerMetadataByGame,
        ...playerCommonTotalsMetadata,
      };
    } catch (error) {
      console.error(error);
      playerGameResultMetadata = {
        ...METADATA_BY_GAME_DEFAULT,
        ...METADATA_COMMON_TOTALS_GAME_DEFAULT,
        errors: [
          ...playerGameResultMetadata.errors,
          {
            name: 'player game result metadata crashed',
            message: error.message,
            date: dateError,
          },
        ],
      };
    }

    this.recalculateSeasonMetadata(statistic.playerId.toString(), gameSeason);

    return playerGameResultMetadata;
  }

  public async recalculateSeasonMetadata(
    playerId: string,
    season: number,
  ): Promise<void> {
    const seasonData = (await this.gameModel.aggregate(
      [
        {
          $sort: {
            number: 1,
          },
        },
        {
          $match: {
            season,
            [`metadata.players.${playerId}`]: {
              $exists: 1,
              $ne: null,
            },
          },
        },
      ],
      { maxTimeMS: 60000, allowDiskUse: true },
    )) as (IGame & { _id: Types.ObjectId })[];

    try {
      const seasonMetadata = seasonData
        .map((seasonGame) => ({
          ...seasonGame,
          id: seasonGame._id.toString(),
        }))
        .reduce((curr, game) => {
          const playerMetadata = game.metadata.players[playerId];
          return accumulatePlayerSeasonMetadata(curr, playerMetadata, game);
        }, METADATA_DEFAULT);

      await this.playerModel.updateOne(
        { _id: playerId },
        { $set: { [`metadata.bySeason.${season}`]: seasonMetadata } },
      );

      await this.recalculateCareerMetadata(playerId);
    } catch (error) {
      console.error(error);
    }
  }

  protected async recalculateCareerMetadata(playerId: string): Promise<void> {
    const seasonsMetadata: FlattenMaps<Record<number, IPlayerMetadata>> =
      (await this.playerModel.findById({ _id: playerId }).exec()).toJSON()
        .metadata?.bySeason ?? {};

    try {
      const accumulatedPlayerCareerMetadata = Object.values(seasonsMetadata)
        // All numbers keys go in order
        // .sort(([seasonA], [seasonB]) => Number(seasonA) - Number(seasonB))
        // .map(([, metadata]) => metadata)
        .reduce((curr, seasonMetdata) => {
          return accumulatePlayerCareerMetadata(curr, seasonMetdata);
        }, METADATA_DEFAULT);

      await this.playerModel.updateOne(
        { _id: playerId },
        { $set: { 'metadata.byCareer': accumulatedPlayerCareerMetadata } },
      );
    } catch (error) {
      console.error(error);
    }
  }
}
