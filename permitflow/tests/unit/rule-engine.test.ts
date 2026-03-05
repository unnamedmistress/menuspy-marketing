import { describe, expect, it } from 'vitest';

import { analyzeIntentHeuristic } from '@/lib/intent-detection';
import { evaluateIntent } from '@/lib/rule-engine';

describe('rule engine', () => {
  it('returns deck prediction with strong confidence', () => {
    const intent = analyzeIntentHeuristic('Build a 260 sqft deck with railing in Seattle');
    const predictions = evaluateIntent(intent);

    expect(predictions.length).toBeGreaterThan(0);
    expect(predictions[0]?.permitType).toBe('DECK');
    expect(predictions[0]?.confidence).toBeGreaterThanOrEqual(70);
  });

  it('falls back to building when unknown', () => {
    const intent = analyzeIntentHeuristic('I need a weird project and no details');
    const predictions = evaluateIntent(intent);

    expect(predictions[0]?.permitType).toBe('BUILDING');
  });
});
