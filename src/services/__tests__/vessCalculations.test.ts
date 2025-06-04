import { calculateSampleScore, calculateEvaluationAverageScore } from '../vessCalculations';
import { LayerData } from '../../types';

describe('vessCalculations', () => {
  describe('calculateSampleScore', () => {
    it('returns 0 when no layers are provided', () => {
      expect(calculateSampleScore([])).toBe(0);
    });

    it('calculates a weighted average score', () => {
      const layers: LayerData[] = [
        { length: 10, score: 2, order: 1 },
        { length: 20, score: 4, order: 2 }
      ];
      // weighted average = (2*10 + 4*20) / (10 + 20) = 3.3
      expect(calculateSampleScore(layers)).toBe(3.3);
    });
  });

  describe('calculateEvaluationAverageScore', () => {
    it('returns 0 when no sample scores are provided', () => {
      expect(calculateEvaluationAverageScore([])).toBe(0);
    });

    it('calculates the mean of sample scores', () => {
      const scores = [2, 3.5, 4];
      const expected = Number(((2 + 3.5 + 4) / 3).toFixed(1));
      expect(calculateEvaluationAverageScore(scores)).toBe(expected);
    });
  });
});
