import { describe, expect, it } from 'vitest';

import { seedPermits, seedPredictions } from '@/lib/mock-data';
import { routeChatMessage } from '@/lib/chat-router';

describe('chat router', () => {
  it('handles status checks', () => {
    const result = routeChatMessage('what is my status?', seedPermits, seedPredictions);

    expect(result.content.toLowerCase()).toContain('status');
  });

  it('handles document help', () => {
    const result = routeChatMessage('which documents do i need', seedPermits, seedPredictions);

    expect(result.content.toLowerCase()).toContain('for');
  });
});
