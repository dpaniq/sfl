import {
  IPlayerMetadata,
  METADATA_DEFAULT,
} from '../constants/player-career-metadata';
import {} from './player-career-metadata';
import { getMaxRepeatedCountHelper } from './player-common-metadata';

describe('player-career-metadata', () => {
  const original = { ...METADATA_DEFAULT };
  let inputMock: IPlayerMetadata = { ...METADATA_DEFAULT };

  beforeEach(() => {
    inputMock = { ...METADATA_DEFAULT };
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
