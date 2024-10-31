import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IGame, IGameMetadata } from '../games/game.schema';
import {
  IPlayerCommonTotalsMetadata,
  IPlayerMetadataByGame,
  METADATA_BY_GAME_DEFAULT,
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

  public async calculatePlayersMetadata(game: WithId<IGame>): Promise<any> {
    // Helpers
    const gameSeason: number = game.season;
    const gameNumber: number = game.number;
    const gameMetadata: IGameMetadata = game.metadata;
    const seasonGameNumberKey: `${number}:${number}` = `${gameSeason}:${gameNumber}`;

    const playersIds = game.statistics.map((stat) => stat.playerId);

    // Previous metadata to recalculate
    const players = await this.playerModel
      .find({ _id: { $in: playersIds } })
      .exec();

    console.log({ players });

    // Todo: this might be slow, probably need to optimize
    for (const stat of game.statistics) {
      const player = players.find((p) => {
        console.log({ p, stat });
        return p.id.toString() === stat.playerId.toString();
      });

      const playerId = player.id.toString();

      if (!player) {
        console.error('Player not found for resolving metadata');
        continue;
      }

      // merge({}, {METADATA_DEFAULT}, player.metadata)

      if (!player.metadata) {
        player.metadata = {
          byGame: {},
          bySeason: {},
          byCareer: { ...METADATA_DEFAULT },
        };
      }

      if (!player.metadata.bySeason) {
        player.metadata.bySeason = {} as any;
      }

      if (!player.metadata.byCareer) {
        player.metadata.byCareer = { ...METADATA_DEFAULT };
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

        asCaptain: stat.isCaptain,
        asFirstDraft,
        asSecondDraft,

        hasWon: asFirstDraft && isTeamFromFirstDraftWon,
        hasLose: asFirstDraft && isTeamFromSecondDraftWon,
        hasDraw: gameMetadata.scoreIsDraw,
      };

      const totalPasses = stat.pass;
      const totalGoalsByLeg = stat.goal;
      const totalGoalsByHead = stat.goalHead;
      const totalGoalsByPenalty = stat.penalty;
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
          totalGoalsByLeg + totalGoalsByHead * 2 + totalGoalsByPenalty,
      };

      // 1. Calculate game metadata | metadata[byGame][season:#]
      player.metadata.byGame = {
        ...player.metadata.byGame,
        [seasonGameNumberKey]: {
          ...playerMetadataByGame,
          ...playerCommonTotalsMetadata,
        },
      };

      // 2. Recalculate season metadata | metadata[games][season]
      player.metadata.bySeason[gameSeason] = Object.keys(player.metadata.byGame)
        .filter((game) => game.startsWith(gameSeason.toString()))
        .reduce((curr, gameKey) => {
          const gameMetadata = player.metadata.byGame[gameKey];

          return accumulatePlayerSeasonMetadata(curr, gameMetadata, game);
        }, METADATA_DEFAULT);

      // 3. Recalculate career metadata | metadata[games] => {...metadata, #1, #2}
      player.metadata.byCareer = Object.values(player.metadata.bySeason).reduce(
        (curr, seasonMetdata) => {
          return accumulatePlayerCareerMetadata(curr, seasonMetdata);
        },
        METADATA_DEFAULT,
      );

      // TODO mongo transaction?
      // Add player metadata for current game
      await this.playerModel
        .updateOne({ _id: player.id }, { metadata: player.metadata })
        .exec();
    }
  }
}

// TODO tests!
/**
 * 
/rest/games/{id}
671156633bb02f7301ac8ed9

{"id":"671156633bb02f7301ac8ed9","status":"new","number":3,"season":2024,"playedAt":"2023-11-18T00:00:00.000Z","teams":[{"name":"BMW","color":"WHITE","description":null,"logo":null,"id":"65f951d0e78734c2150ef003"},{"name":"HONDA","color":"RED","description":null,"logo":null,"id":"65f951dee78734c2150ef007"}],"statistics":[{"playerId":"658ddee2f71a72e6d8ea9614","teamId":"65f951d0e78734c2150ef003","goal":0,"goalHead":1,"autoGoal":0,"penalty":0,"pass":4,"mvp":false,"isCaptain":true,"isTransferable":false},{"playerId":"658ddee2f71a72e6d8ea960e","teamId":"65f951dee78734c2150ef007","goal":0,"goalHead":0,"autoGoal":0,"penalty":0,"pass":3,"mvp":false,"isCaptain":true,"isTransferable":false}]}
 */
