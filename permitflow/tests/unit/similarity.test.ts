import { describe, expect, it } from 'vitest';

import { seedHistoricalPermits, seedPermits } from '@/lib/mock-data';
import { findSimilarPermits } from '@/lib/similarity';

describe('similarity engine', () => {
  it('returns top-k ordered matches', () => {
    const matches = findSimilarPermits(seedPermits[0], seedHistoricalPermits, 5);

    expect(matches).toHaveLength(5);
    expect(matches[0].score).toBeGreaterThanOrEqual(matches[1].score);
  });
});
