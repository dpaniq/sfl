import {
  IPlayerMetadata,
  METADATA_DEFAULT,
  RATING_SYSTEM_DEFAULT,
} from '../constants/player-career-metadata';
import {
  calculateCareerAncientRatingSystem,
  calculateCareerPositionalRatingSystem,
} from './player-career-metadata';

describe('player-career-metadata', () => {
  const original = { ...METADATA_DEFAULT };
  let inputMock: IPlayerMetadata = { ...METADATA_DEFAULT };

  beforeEach(() => {
    inputMock = { ...METADATA_DEFAULT };
  });

  describe('calculateCareerAncientRatingSystem', () => {
    it('should count career anctientRatingSystem properly', () => {
      expect(
        calculateCareerAncientRatingSystem(RATING_SYSTEM_DEFAULT, {
          plusMinus: 1,
          lastResult: 1,
          totalPoints: 3,
        }),
      ).toEqual({
        plusMinus: 1,
        lastResult: 1,
        totalPoints: 3,
      });
    });
  });

  describe('calculateCareerPositionalRatingSystem', () => {
    it('should count career positionalRatingSystem properly', () => {
      expect(
        calculateCareerPositionalRatingSystem(
          RATING_SYSTEM_DEFAULT,
          RATING_SYSTEM_DEFAULT,
        ),
      ).toEqual({
        plusMinus: 0,
        lastResult: 0,
        totalPoints: 0,
      });
    });
  });
});
