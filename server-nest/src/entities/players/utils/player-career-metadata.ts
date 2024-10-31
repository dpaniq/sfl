import { IPlayerMetadata } from '../constants/player-career-metadata';
import {
  concatArraysByKey,
  getMaxRepeatedCountHelper,
  sumByKey,
} from './player-common-metadata';

export function calculateCareerAncientRatingSystem(
  original: IPlayerMetadata['ancientRatingSystem'],
  input: IPlayerMetadata['ancientRatingSystem'],
): IPlayerMetadata['ancientRatingSystem'] {
  return {
    plusMinus: original.plusMinus + input.plusMinus,
    lastResult: original.lastResult + input.lastResult,
    totalPoints: original.totalPoints + input.totalPoints,
  };
}

export function calculateCareerPositionalRatingSystem(
  original: IPlayerMetadata['positionalRatingSystem'],
  input: IPlayerMetadata['positionalRatingSystem'],
): IPlayerMetadata['positionalRatingSystem'] {
  return {
    plusMinus: 0,
    lastResult: 0,
    totalPoints: 0,
  };
}

export function accumulatePlayerCareerMetadata(
  original: IPlayerMetadata,
  input: IPlayerMetadata,
): IPlayerMetadata {
  const gamesResults = concatArraysByKey('gamesResults', {
    original,
    input,
  }) as (1 | 0 | -1)[];

  return {
    totalPasses: sumByKey('totalPasses', { original, input }),
    totalGoalsByLeg: sumByKey('totalGoalsByLeg', { original, input }),
    totalGoalsByHead: sumByKey('totalGoalsByHead', { original, input }),
    totalGoalsByPenalty: sumByKey('totalGoalsByPenalty', { original, input }),
    totalGoalsByAuto: sumByKey('totalGoalsByAuto', { original, input }),
    totalGoals: sumByKey('totalGoals', { original, input }),

    totalGames: sumByKey('totalGames', { original, input }),
    totalWonGames: sumByKey('totalWonGames', { original, input }),
    totalDraws: sumByKey('totalDraws', { original, input }),
    totalLostGames: sumByKey('totalLostGames', { original, input }),

    totalMvp: sumByKey('totalMvp', { original, input }),
    totalMvpByGoals: sumByKey('totalMvpByGoals', { original, input }),
    totalMvpByPasses: sumByKey('totalMvpByPasses', { original, input }),

    totalPlayedAsCaptain: sumByKey('totalPlayedAsCaptain', { original, input }),
    totalPlayedAsTransfer: sumByKey('totalPlayedAsTransfer', {
      original,
      input,
    }),
    totalPlayedAsFirstDraft: sumByKey('totalPlayedAsFirstDraft', {
      original,
      input,
    }),
    totalPlayedAsSecondDraft: sumByKey('totalPlayedAsSecondDraft', {
      original,
      input,
    }),

    gamesResults,
    gamesIds: concatArraysByKey('gamesIds', { original, input }) as string[],
    captainedGamesIds: concatArraysByKey('captainedGamesIds', {
      original,
      input,
    }) as string[],
    captainedByPlayersIds: concatArraysByKey('captainedByPlayersIds', {
      original,
      input,
    }) as string[],

    gamesMaxWinStreak: getMaxRepeatedCountHelper(gamesResults, 1),
    gamesMaxDraftStreak: getMaxRepeatedCountHelper(gamesResults, 0),
    gamesMaxLostStreak: getMaxRepeatedCountHelper(gamesResults, -1),

    ancientRatingSystem: calculateCareerAncientRatingSystem(
      original.ancientRatingSystem,
      input.ancientRatingSystem,
    ),
    positionalRatingSystem: calculateCareerPositionalRatingSystem(
      original.positionalRatingSystem,
      input.positionalRatingSystem,
    ),
  };
}
