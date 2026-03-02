import { afterEach, describe, expect, it, vi } from 'vitest';
import { analyzeJobRequirements, __setOpenAIClientForTests, validateDocument } from './ai';
import { JobAnalysisRequest } from '@/types/permit';

const baseRequest: JobAnalysisRequest = {
  jobType: 'RE_ROOFING',
  jurisdiction: 'PINELLAS_COUNTY',
  address: '123 Main St, Clearwater, FL',
  description: 'Tear-off and reroof a single-family home'
};

function createMockOpenAIClient(responseFactory: () => Promise<unknown>) {
  const create = vi.fn().mockImplementation(responseFactory);
  return {
    client: {
      chat: {
        completions: {
          create
        }
      }
    },
    create
  };
}

describe('analyzeJobRequirements', () => {
  afterEach(() => {
    __setOpenAIClientForTests(undefined);
    vi.clearAllMocks();
  });

  it('returns validated requirements from mocked OpenAI response', async () => {
    const { client, create } = createMockOpenAIClient(async () => ({
      choices: [
        {
          message: {
            content: JSON.stringify({
              requirements: [
                {
                  category: 'document',
                  title: 'Permit Application',
                  description: 'Completed county permit form',
                  isRequired: true
                },
                {
                  category: 'inspection',
                  title: 'Final Inspection',
                  description: 'Schedule final inspection after work completion',
                  isRequired: true
                }
              ],
              estimatedTimeline: '7-14 business days',
              estimatedCost: '$300-700',
              confidenceScore: 0.92
            })
          }
        }
      ]
    }));

    __setOpenAIClientForTests(client as never);

    const result = await analyzeJobRequirements(baseRequest);

    expect(create).toHaveBeenCalledTimes(1);
    expect(result.requirements).toHaveLength(2);
    expect(result.requirements[0]).toMatchObject({
      category: 'document',
      title: 'Permit Application',
      isRequired: true,
      status: 'pending'
    });
    expect(result.estimatedTimeline).toBe('7-14 business days');
    expect(result.estimatedCost).toBe('$300-700');
    expect(result.confidenceScore).toBe(0.92);
  });

  it('falls back to default requirements when AI request fails', async () => {
    const { client } = createMockOpenAIClient(async () => {
      throw new Error('OpenAI unavailable');
    });
    __setOpenAIClientForTests(client as never);

    const result = await analyzeJobRequirements(baseRequest);

    expect(result.confidenceScore).toBe(0.6);
    expect(result.requirements).toHaveLength(3);
    expect(result.requirements.map((r) => r.title)).toContain('Permit Application');
  });

  it('falls back when AI response fails schema validation', async () => {
    const { client } = createMockOpenAIClient(async () => ({
      choices: [
        {
          message: {
            content: JSON.stringify({
              requirements: [
                {
                  category: 'unknown',
                  title: 'Bad Data',
                  description: 'Invalid category',
                  isRequired: true
                }
              ]
            })
          }
        }
      ]
    }));
    __setOpenAIClientForTests(client as never);

    const result = await analyzeJobRequirements(baseRequest);

    expect(result.confidenceScore).toBe(0.6);
    expect(result.requirements.map((r) => r.title)).toContain('Permit Application');
  });
});

describe('validateDocument', () => {
  afterEach(() => {
    __setOpenAIClientForTests(undefined);
    vi.clearAllMocks();
  });

  it('returns validated document result from mocked OpenAI response', async () => {
    const { client } = createMockOpenAIClient(async () => ({
      choices: [
        {
          message: {
            content: JSON.stringify({
              isValid: false,
              issues: ['Missing contractor signature']
            })
          }
        }
      ]
    }));
    __setOpenAIClientForTests(client as never);

    const result = await validateDocument('permit application', 'Sample content');

    expect(result).toEqual({
      isValid: false,
      issues: ['Missing contractor signature']
    });
  });

  it('returns permissive fallback when validation call throws', async () => {
    const { client } = createMockOpenAIClient(async () => {
      throw new Error('Validation timeout');
    });
    __setOpenAIClientForTests(client as never);

    const result = await validateDocument('insurance certificate', 'Sample content');

    expect(result).toEqual({ isValid: true, issues: [] });
  });
});
