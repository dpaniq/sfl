import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PlayersService } from '../players';
import { Game, IGame, IGameMetadata } from './game.schema';

@Injectable()
export class GamesService {
  constructor(
    @InjectModel(Game.name)
    private readonly gameModel: Model<IGame>,

    private readonly playersService: PlayersService,
  ) {}

  async find(game: Partial<IGame>) {
    return await this.gameModel.find({ ...game }).exec();
  }

  async findById(_id: string) {
    return await this.gameModel.findById({ _id }).exec();
  }

  async save(game: IGame) {
    if (
      await this.gameModel.findOne({
        number: game.number,
        season: game.season,
      })
    ) {
      throw ConflictException;
    }

    // TODO MongoDB transaction to avoid race conditions
    // TODO need save first then update metadata based on the game
    const metadata = await this.calculateGameMetadata(game);

    return await this.gameModel.create({ ...game, metadata });
  }

  async replace(_id: string, game: IGame) {
    const metadata = await this.calculateGameMetadata(game);
    // TODO
    // await this.playersService.recalculateSeasonMetadata(
    //   stat.playerId.toString(),
    //   game.season,
    // );

    // TODO MongoDB transaction to avoid race conditions

    const replacedGame = (
      await this.gameModel
        .findOneAndReplace({ _id }, { ...game, metadata })
        .exec()
    ).toJSON();

    if (!replacedGame) {
      throw BadRequestException;
    }

    return replacedGame;
  }

  async delete(_id: string) {
    const game = await this.gameModel.findOneAndDelete({ _id }).exec();

    if (!game) {
      throw BadRequestException;
    }

    return !!game;
  }

  public async calculateGameMetadata(game: IGame): Promise<IGameMetadata> {
    // Helpers
    const teamFirstIdHelper = game.teams.at(0).id;
    const teamSecondIdHelper = game.teams.at(1).id;

    // Common
    const totalPlayers: number = game.statistics.length;
    const totalGoalsByLeg: number = game.statistics.reduce(
      (curr, next) => curr + next.goal,
      0,
    );
    const totalGoalsByHead: number = game.statistics.reduce(
      (curr, next) => curr + next.goalHead,
      0,
    );
    const totalGoalsByPenalty: number = game.statistics.reduce(
      (curr, next) => curr + next.penalty,
      0,
    );
    const totalGoalsByAuto: number = game.statistics.reduce(
      (curr, next) => curr + 0, // TODO (next.goalAuto ?? 0),
      0,
    );
    const totalPasses: number = game.statistics.reduce(
      (curr, next) => curr + next.pass,
      0,
    );

    const totalGoals: number =
      totalGoalsByLeg + totalGoalsByHead * 2 + totalGoalsByPenalty;
    const totalPoints: number = totalGoals + totalPasses;

    // Score
    const score: [number, number] = game.statistics.reduce(
      (curr, next) => {
        const currentScore =
          (next.goal ?? 0) + (next.goalHead ?? 0) * 2 + (next.penalty ?? 0);

        if (next.teamId === teamFirstIdHelper) {
          return [curr.at(0) + currentScore, curr.at(1)];
        } else if (next.teamId === teamSecondIdHelper) {
          return [curr.at(0), curr.at(1) + currentScore];
        } else {
          throw new InternalServerErrorException(
            'Unexpected error occurred while calculating score metadata',
          );
        }
      },
      [0, 0],
    );
    const scoreIsDraw: boolean = score.at(0) === score.at(1);
    const scoreFirstDraft: number = score.at(0);
    const scoreSecondDraft: number = score.at(1);

    // Team
    const teamWon: string | null = scoreIsDraw
      ? null
      : score.at(0) > score.at(1)
        ? teamFirstIdHelper
        : teamSecondIdHelper;

    const teamLost: string | null = scoreIsDraw
      ? null
      : score.at(0) < score.at(1)
        ? teamFirstIdHelper
        : teamSecondIdHelper;

    const isTeamFromFirstDraftWon = scoreFirstDraft > scoreSecondDraft;
    const isTeamFromFirstDraftLost = scoreFirstDraft < scoreSecondDraft;
    const isTeamFromSecondDraftWon = scoreFirstDraft < scoreSecondDraft;
    const isTeamFromSecondDraftLost = scoreFirstDraft > scoreSecondDraft;

    // Captains
    const captainFirstDraft: string = game.statistics.find(
      (stat) => stat.isCaptain && stat.teamId === teamFirstIdHelper,
    )!.playerId;

    const captainSecondDraft: string = game.statistics.find(
      (stat) => stat.isCaptain && stat.teamId === teamSecondIdHelper,
    )!.playerId;

    const captainWon: string | null =
      scoreFirstDraft > scoreSecondDraft
        ? captainFirstDraft
        : captainSecondDraft;
    const captainLost: string | null =
      scoreFirstDraft < scoreSecondDraft
        ? captainFirstDraft
        : captainSecondDraft;

    const isCaptainFirstDraftWon: boolean =
      !scoreIsDraw && captainWon === captainFirstDraft;
    const isCaptainFirstDraftDraw: boolean = scoreIsDraw;
    const isCaptainFirstDraftLost: boolean =
      !scoreIsDraw && captainLost === captainFirstDraft;

    const isCaptainSecondDraftWon: boolean =
      !scoreIsDraw && captainWon === captainSecondDraft;
    const isCaptainSecondDraftDraw: boolean = scoreIsDraw;
    const isCaptainSecondDraftLost: boolean =
      !scoreIsDraw && captainLost === captainSecondDraft;

    // Players
    const playerIdsOfFirstDraft = game.statistics
      .filter((stat) => stat.teamId === teamFirstIdHelper)
      .map((stat) => stat.playerId);
    const playerIdsOfSecondDraft = game.statistics
      .filter((stat) => stat.teamId === teamSecondIdHelper)
      .map((stat) => stat.playerId);

    // MVPs
    // mvpByPassesIds
    const maxPassesNumberHelper = [
      ...new Set(
        game.statistics
          .map((stat) => stat.pass)
          .sort((pass1, pass2) => pass2 - pass1),
      ),
    ].at(0);

    const mvpByPassesIds: string[] = !maxPassesNumberHelper
      ? []
      : game.statistics
          .filter((stat) => stat.pass === maxPassesNumberHelper)
          .map((stat) => stat.playerId);

    // mvpByGoalsIds
    const maxGoalNumberHelper = [
      ...new Set(
        game.statistics
          .map((stat) => stat.goal)
          .sort((goal1, goal2) => goal2 - goal1),
      ),
    ].at(0);

    const mvpByGoalsIds: string[] = !maxGoalNumberHelper
      ? []
      : game.statistics
          .filter((stat) => stat.goal === maxGoalNumberHelper)
          .map((stat) => stat.playerId);

    // mvpByGoalsHeadIds
    const maxGoalsHeadNumberHelper = [
      ...new Set(
        game.statistics
          .map((stat) => stat.goalHead)
          .sort((goalHead1, goalHead2) => goalHead2 - goalHead1),
      ),
    ].at(0);

    const mvpByGoalsHeadIds: string[] = !maxGoalsHeadNumberHelper
      ? []
      : game.statistics
          .filter((stat) => stat.goalHead === maxGoalsHeadNumberHelper)
          .map((stat) => stat.playerId);

    // mvpListIds
    const mvpListIds: string[] = game.statistics.reduce(
      (curr, next) => (next.mvp ? [...curr, next.playerId] : curr),
      [],
    );

    const metadata: IGameMetadata = {
      // Common
      totalPasses,
      totalPlayers,
      totalGoalsByLeg,
      totalGoalsByHead,
      totalGoalsByPenalty,
      totalGoalsByAuto,
      totalGoals,
      totalPoints,

      // Score
      score,
      scoreIsDraw,
      scoreFirstDraft,
      scoreSecondDraft,

      // Team
      teamWon,
      teamLost,
      isTeamFromFirstDraftWon,
      isTeamFromFirstDraftLost,
      isTeamFromSecondDraftWon,
      isTeamFromSecondDraftLost,

      // Captains
      captainFirstDraft,
      captainSecondDraft,
      captainWon,
      captainLost,
      isCaptainFirstDraftWon,
      isCaptainFirstDraftDraw,
      isCaptainFirstDraftLost,
      isCaptainSecondDraftWon,
      isCaptainSecondDraftDraw,
      isCaptainSecondDraftLost,

      playerIdsOfFirstDraft,
      playerIdsOfSecondDraft,

      // MVP
      mvpByGoalsIds,
      mvpByGoalsHeadIds,
      mvpByPassesIds,
      mvpListIds,

      players: {},
    };

    // players
    const players = {};
    // Todo: this might be slow, probably need to optimize
    for (const stat of game.statistics) {
      players[stat.playerId.toString()] =
        await this.playersService.calculatePlayerGameResultMetadata(stat, {
          ...game,
          metadata,
        });
    }

    metadata.players = players;

    return metadata;
  }
}
