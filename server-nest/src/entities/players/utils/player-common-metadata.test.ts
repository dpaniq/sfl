import {
  IPlayerMetadata,
  METADATA_DEFAULT,
} from '../constants/player-career-metadata';
import {} from './player-career-metadata';
import {
  concatArraysByKey,
  getMaxRepeatedCountHelper,
  sumByKey,
  SumOfMetadataAllowedKeys,
} from './player-common-metadata';

describe('player-career-metadata', () => {
  const original = { ...METADATA_DEFAULT };
  let inputMock: IPlayerMetadata = { ...METADATA_DEFAULT };

  beforeEach(() => {
    inputMock = { ...METADATA_DEFAULT };
  });

  describe('sumByKey', () => {
    it('should sum up numbers', () => {
      const allowedKeys: SumOfMetadataAllowedKeys[] = [
        'totalGames',
        'totalGoals',
        'totalGoalsByHead',
        'totalGoalsByLeg',
        'totalGoalsByPenalty',
        'totalGoalsByAuto',
        'totalMvp',
        'totalMvpByGoals',
        'totalMvpByPasses',
        'totalPlayedAsCaptain',
        'totalPlayedAsFirstDraft',
        'totalPlayedAsSecondDraft',
        'totalPlayedAsTransfer',
        'totalPasses',
        'totalWonGames',
        'totalLostGames',
        'totalDraws',
      ];

      allowedKeys.forEach((key) => {
        expect(
          sumByKey(key, { original, input: { ...inputMock, [key]: 10 } }),
        ).toBe(10);
      });
    });
  });

  describe('concatArraysByKey', () => {
    it('should sum up numbers', () => {
      expect(
        concatArraysByKey('gamesResults', {
          original,
          input: { ...inputMock, gamesResults: [0, 0, 1] },
        }),
      ).toEqual([0, 0, 1]);

      expect(
        concatArraysByKey('gamesIds', {
          original,
          input: { ...inputMock, gamesIds: ['gm1', 'gm2', 'gm3'] },
        }),
      ).toEqual(['gm1', 'gm2', 'gm3']);

      expect(
        concatArraysByKey('captainedByPlayersIds', {
          original,
          input: {
            ...inputMock,
            captainedByPlayersIds: ['cap1', 'cap2', 'cap3'],
          },
        }),
      ).toEqual(['cap1', 'cap2', 'cap3']);

      expect(
        concatArraysByKey('captainedGamesIds', {
          original,
          input: { ...inputMock, captainedGamesIds: ['gm1', 'gm2', 'gm3'] },
        }),
      ).toEqual(['gm1', 'gm2', 'gm3']);
    });
  });

  describe('getMaxRepeatedCountHelper', () => {
    const array = [
      -1, 0, 1, -1, -1, 0, 1, -1, 0, 0, 0, 1, -1, 0, 1, 1, 1, 1, -1, 0, 1, -1,
      0, 1, -1,
    ];

    it('should get max repeated count of number', () => {
      expect(getMaxRepeatedCountHelper(array, -1)).toBe(2);
      expect(getMaxRepeatedCountHelper(array, 0)).toBe(3);
      expect(getMaxRepeatedCountHelper(array, 1)).toBe(4);
    });
  });
});
