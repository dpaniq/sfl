import { IGame } from 'src/entities/games/game.schema';
import {
  IPlayerCommonTotalsMetadata,
  IPlayerMetadata,
  IPlayerMetadataByGame,
} from '../constants/player-career-metadata';
import { getMaxRepeatedCountHelper, sum } from './player-common-metadata';

export function accumulatePlayerSeasonMetadata(
  original: IPlayerMetadata,
  input: IPlayerMetadataByGame & IPlayerCommonTotalsMetadata,
  game: WithId<IGame>,
): IPlayerMetadata {
  // Helpers
  const gameId = game.id.toString();
  const gameMetadata = game.metadata;
  const gameCaptainFirstDraft = gameMetadata.captainFirstDraft;
  const gameCaptainSecondDraft = gameMetadata.captainSecondDraft;

  const plusMinus = input.asFirstDraft
    ? gameMetadata.scoreFirstDraft - gameMetadata.scoreSecondDraft
    : gameMetadata.scoreSecondDraft - gameMetadata.scoreFirstDraft;

  const lr = input.hasDraw ? 0 : input.hasWon ? 1 : -1;
  const gamesResults: (1 | 0 | -1)[] = [...original.gamesResults, lr];

  const inputTotalPoints =
    input.totalGoalsByLeg +
    input.totalGoalsByPenalty +
    input.totalGoalsByHead * 2;

  return {
    totalPasses: sum(original.totalPasses, input.totalPasses),
    totalGoalsByLeg: sum(original.totalGoalsByLeg, input.totalGoalsByLeg),
    totalGoalsByHead: sum(original.totalGoalsByHead, input.totalGoalsByHead),
    totalGoalsByPenalty: sum(
      original.totalGoalsByPenalty,
      input.totalGoalsByPenalty,
    ),
    totalGoalsByAuto: sum(original.totalGoalsByAuto, input.totalGoalsByAuto),
    totalGoals: sum(original.totalGoals, input.totalGoals),

    totalGames: sum(original.totalGames, 1),
    totalWonGames: sum(original.totalWonGames, +input.hasWon),
    totalDraws: sum(original.totalDraws, +input.hasDraw),
    totalLostGames: sum(original.totalLostGames, +input.hasLose),

    totalMvp: sum(original.totalMvp, +input.isMvp),
    totalMvpByGoals: sum(original.totalMvpByGoals, +input.isMvpByGoals),
    totalMvpByPasses: sum(original.totalMvpByPasses, +input.isMvpByPasses),

    totalPlayedAsTransfer: sum(
      original.totalPlayedAsTransfer,
      +input.asTransfer,
    ),
    totalPlayedAsCaptain: sum(original.totalPlayedAsCaptain, +input.asCaptain),
    totalPlayedAsFirstDraft: sum(
      original.totalPlayedAsFirstDraft,
      +input.asFirstDraft,
    ),
    totalPlayedAsSecondDraft: sum(
      original.totalPlayedAsSecondDraft,
      +input.asSecondDraft,
    ),

    gamesResults,
    gamesIds: original.gamesIds.concat([gameId]),

    gamesMaxWinStreak: getMaxRepeatedCountHelper(gamesResults, 1),
    gamesMaxDraftStreak: getMaxRepeatedCountHelper(gamesResults, 0),
    gamesMaxLostStreak: getMaxRepeatedCountHelper(gamesResults, -1),

    captainedGamesIds: input.asCaptain
      ? original.gamesIds.concat([gameId])
      : original.captainedGamesIds,
    captainedByPlayersIds: input.asCaptain
      ? original.captainedByPlayersIds
      : original.captainedByPlayersIds.concat([
          input.asFirstDraft ? gameCaptainFirstDraft : gameCaptainSecondDraft,
        ]),

    // Rating System
    ancientRatingSystem: {
      plusMinus: original.ancientRatingSystem.plusMinus + plusMinus,
      lastResult: original.ancientRatingSystem.lastResult + lr,
      totalPoints: original.ancientRatingSystem.totalPoints + inputTotalPoints,
    },
    // Todo: position needs to be updated
    positionalRatingSystem: {
      plusMinus: 0,
      lastResult: 0,
      totalPoints: 0,
    },
  };
}
