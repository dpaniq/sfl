import { Injectable, Optional } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FlattenMaps, Model, Types } from 'mongoose';
import {
  Game,
  IGame,
  IGameMetadata,
  IPlayerGameResultMetadata,
  PlayerStatistic,
} from '../games/game.schema';
import { UsersService } from '../users/users.service';
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

    @Optional()
    private usersService: UsersService,
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
    let deletedPlayer: ServerPlayer | null = null;
    try {
      deletedPlayer = await this.playerModel
        .findByIdAndDelete({ _id: id })
        .populate('user')
        .exec();

      const userId = deletedPlayer.user.id.toString()!;
      await this.usersService.deleteUserById(userId);

      return deletedPlayer;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  public async calculatePlayerGameResultMetadata(
    playerId: string,
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

    const statistics: PlayerStatistic[] = game.statistics.filter(
      (s) => s.playerId === playerId,
    );
    const isPlayerInBothTeams = statistics.length === 2;

    // Player can be transfered and play for both team
    const statistic = isPlayerInBothTeams
      ? statistics.at(0)
      : statistics.reduce(
          (acc, next) => {
            return {
              playerId: next.playerId,
              teamId: next.teamId,

              passes: acc.passes + next.passes,
              goalsByLeg: acc.goalsByLeg + next.goalsByLeg,
              goalsByHead: acc.goalsByHead + next.goalsByHead,
              goalsByAuto: acc.goalsByAuto + next.goalsByAuto,
              goalsByPenalty: acc.goalsByPenalty + next.goalsByPenalty,

              isMVP: acc.isMVP || next.isMVP,
              isCaptain: acc.isCaptain || next.isCaptain,
              isTransfer: acc.isTransfer || next.isTransfer,
            };
          },
          {
            playerId: '',
            teamId: '',

            passes: 0,
            goalsByLeg: 0,
            goalsByHead: 0,
            goalsByAuto: 0,
            goalsByPenalty: 0,

            isMVP: false,
            isCaptain: false,
            isTransfer: false,
          } as PlayerStatistic,
        );

    // Previous metadata to recalculate

    // Todo: this might be slow, probably need to optimize

    try {
      const player = await this.playerModel.findOne({ _id: playerId }).exec();

      if (!player) {
        throw new Error('Player is not found');
      }

      // TODO move to helpers
      const isTeamFromFirstDraftWon =
        gameMetadata.scoreFirstDraft > gameMetadata.scoreSecondDraft;
      const isTeamFromSecondDraftWon =
        gameMetadata.scoreFirstDraft < gameMetadata.scoreSecondDraft;

      const asFirstDraft = isPlayerInBothTeams
        ? true
        : gameMetadata.playerIdsOfFirstDraft.includes(playerId);
      const asSecondDraft = isPlayerInBothTeams
        ? true
        : gameMetadata.playerIdsOfSecondDraft.includes(playerId);

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
        asTransfer: statistic.isTransfer,

        hasWon: isPlayerInBothTeams
          ? false
          : asFirstDraft && isTeamFromFirstDraftWon,
        hasLose: isPlayerInBothTeams
          ? false
          : asFirstDraft && isTeamFromSecondDraftWon,
        hasDraw: isPlayerInBothTeams ? false : gameMetadata.scoreIsDraw,
      };

      const totalPasses = statistic.passes;
      const totalGoalsByLeg = statistic.goalsByLeg;
      const totalGoalsByHead = statistic.goalsByHead;
      const totalGoalsByPenalty = statistic.goalsByHead;
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
