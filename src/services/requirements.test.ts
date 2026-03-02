import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Requirement } from '@/types/permit';

const analyzeJobRequirementsMock = vi.fn();

vi.mock('./ai', () => ({
  analyzeJobRequirements: (...args: unknown[]) => analyzeJobRequirementsMock(...args)
}));

import {
  __resetRequirementsCacheForTests,
  calculateProgress,
  categorizeRequirements,
  getRequirementsForJob
} from './requirements';

function makeRequirement(partial: Partial<Requirement> = {}): Requirement {
  return {
    id: `req-${Math.random()}`,
    jobId: '',
    category: 'document',
    title: 'Permit Application',
    description: 'Complete permit application',
    isRequired: true,
    confidence: 1,
    status: 'pending',
    ...partial
  };
}

describe('getRequirementsForJob', () => {
  beforeEach(() => {
    analyzeJobRequirementsMock.mockReset();
    __resetRequirementsCacheForTests();
  });

  it('caches AI results by job type and jurisdiction', async () => {
    analyzeJobRequirementsMock.mockResolvedValue({
      requirements: [
        makeRequirement({ id: 'original-id-1', category: 'document' }),
        makeRequirement({ id: 'original-id-2', category: 'inspection' })
      ],
      estimatedTimeline: '5-10 business days',
      estimatedCost: '$150-500',
      confidenceScore: 0.9
    });

    const first = await getRequirementsForJob(
      'RE_ROOFING',
      'PINELLAS_COUNTY',
      '123 Main St',
      'Roof replacement'
    );
    const second = await getRequirementsForJob(
      'RE_ROOFING',
      'PINELLAS_COUNTY',
      '456 Oak St',
      'Same permit type'
    );

    expect(analyzeJobRequirementsMock).toHaveBeenCalledTimes(1);
    expect(first).toHaveLength(2);
    expect(second).toHaveLength(2);
    expect(second[0].id).not.toBe('');
  });

  it('returns default requirements when analysis throws', async () => {
    analyzeJobRequirementsMock.mockRejectedValue(new Error('AI request failed'));

    const result = await getRequirementsForJob(
      'RE_ROOFING',
      'PINELLAS_COUNTY',
      '789 Pine St',
      'Roof work'
    );

    expect(result.length).toBeGreaterThanOrEqual(5);
    expect(result.map((r) => r.title)).toContain('Roof Plan');
  });
});

describe('categorizeRequirements', () => {
  it('splits requirements by category', () => {
    const requirements: Requirement[] = [
      makeRequirement({ category: 'document' }),
      makeRequirement({ category: 'drawing' }),
      makeRequirement({ category: 'inspection' }),
      makeRequirement({ category: 'license' }),
      makeRequirement({ category: 'insurance' }),
      makeRequirement({ category: 'fee' })
    ];

    const categorized = categorizeRequirements(requirements);

    expect(categorized.documents).toHaveLength(1);
    expect(categorized.drawings).toHaveLength(1);
    expect(categorized.inspections).toHaveLength(1);
    expect(categorized.licenses).toHaveLength(1);
    expect(categorized.insurance).toHaveLength(1);
    expect(categorized.fees).toHaveLength(1);
  });
});

describe('calculateProgress', () => {
  it('returns rounded completion percentage', () => {
    const requirements: Requirement[] = [
      makeRequirement({ status: 'completed' }),
      makeRequirement({ status: 'completed' }),
      makeRequirement({ status: 'pending' })
    ];

    expect(calculateProgress(requirements)).toBe(67);
  });

  it('returns 0 for empty requirements list', () => {
    expect(calculateProgress([])).toBe(0);
  });
});
