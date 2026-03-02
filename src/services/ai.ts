import OpenAI from 'openai';
import { logger } from '@/lib/logger';
import { retry } from '@/lib/retry';
import { JobAnalysisRequest, JobAnalysisResponse, Requirement } from '@/types/permit';
import { aiDocumentValidationSchema, aiJobAnalysisSchema } from '@/types/schemas';

type OpenAIClient = Pick<OpenAI, 'chat'>;

let openaiClient: OpenAIClient | null | undefined;

function getApiKey(): string | null {
  const key = (import.meta.env.VITE_OPENAI_API_KEY as string | undefined)?.trim();
  return key ? key : null;
}

function getOpenAIClient(): OpenAIClient | null {
  if (openaiClient !== undefined) {
    return openaiClient;
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    logger.warn('Missing OpenAI API key, AI features will use fallback behavior');
    openaiClient = null;
    return openaiClient;
  }

  openaiClient = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true
  });
  logger.info('AI client initialized', { hasApiKey: true });
  return openaiClient;
}

export function __setOpenAIClientForTests(client: OpenAIClient | null | undefined): void {
  if (import.meta.env.MODE !== 'test') {
    return;
  }
  openaiClient = client;
}

function serializeError(error: unknown): Record<string, unknown> {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack
    };
  }

  if (typeof error === 'object' && error !== null) {
    return error as Record<string, unknown>;
  }

  return { error };
}

function isRetryableAiError(error: unknown): boolean {
  if (typeof error === 'object' && error !== null) {
    const status = (error as { status?: number }).status;
    if (typeof status === 'number') {
      return status === 429 || status >= 500;
    }

    const code = (error as { code?: string }).code;
    if (typeof code === 'string') {
      return ['ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND'].includes(code);
    }

    const message = (error as { message?: string }).message;
    if (typeof message === 'string') {
      const lowerMessage = message.toLowerCase();
      return (
        lowerMessage.includes('timeout') ||
        lowerMessage.includes('network') ||
        lowerMessage.includes('temporarily')
      );
    }
  }

  return false;
}

export async function analyzeJobRequirements(
  request: JobAnalysisRequest
): Promise<JobAnalysisResponse> {
  const systemPrompt = `You are a permit requirements expert for Pinellas County, Florida. 
Given a job description, determine the specific permit requirements.

Respond with a JSON object containing:
- requirements: array of requirement objects with category, title, description, isRequired
- estimatedTimeline: typical processing time
- estimatedCost: permit fee estimate
- confidenceScore: 0-1 confidence in the analysis

Categories: document, drawing, inspection, fee, license, insurance`;

  const userPrompt = `Job Type: ${request.jobType}
Jurisdiction: ${request.jurisdiction}
Address: ${request.address}
Description: ${request.description}
${request.squareFootage ? `Square Footage: ${request.squareFootage}` : ''}
${request.yearBuilt ? `Year Built: ${request.yearBuilt}` : ''}`;

  const client = getOpenAIClient();
  if (!client) {
    logger.warn('OpenAI client unavailable, using fallback requirements');
    return getFallbackRequirements(request.jobType);
  }

  try {
    const response = await retry(
      async () =>
        client.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.2
        }),
      {
        maxAttempts: 3,
        initialDelayMs: 500,
        maxDelayMs: 4000,
        backoffMultiplier: 2,
        shouldRetry: isRetryableAiError,
        onRetry: async (error, attempt, nextDelayMs) => {
          logger.warn('Retrying AI analysis request', {
            attempt,
            nextDelayMs,
            error: serializeError(error)
          });
        }
      }
    );

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from AI');
    }

    const parsedResult = aiJobAnalysisSchema.parse(JSON.parse(content));

    return {
      requirements: parsedResult.requirements.map((requirement, index) => ({
        id: `req-${Date.now()}-${index}`,
        jobId: '',
        category: requirement.category,
        title: requirement.title,
        description: requirement.description,
        isRequired: requirement.isRequired,
        confidence: parsedResult.confidenceScore ?? 0.8,
        status: 'pending',
        actionType: requirement.actionType,
        sourceUrl: requirement.sourceUrl,
        minimumCriteria: requirement.minimumCriteria,
        whoCanHelp: requirement.whoCanHelp,
        plainLanguageWhy: requirement.plainLanguageWhy,
        acceptedFormats: requirement.acceptedFormats ?? ['PDF', 'JPG', 'PNG'],
        allowsMultipleUploads: requirement.allowsMultipleUploads ?? false,
        goodUploadExample: requirement.goodUploadExample
      })),
      estimatedTimeline: parsedResult.estimatedTimeline || '5-10 business days',
      estimatedCost: parsedResult.estimatedCost || '$150-500',
      confidenceScore: parsedResult.confidenceScore ?? 0.8
    };
  } catch (error) {
    logger.error('AI analysis failed, using fallback requirements', {
      error: serializeError(error),
      jobType: request.jobType,
      jurisdiction: request.jurisdiction
    });
    return getFallbackRequirements(request.jobType);
  }
}

function getFallbackRequirements(jobType: string): JobAnalysisResponse {
  logger.info('Generating fallback requirements', { jobType });

  const baseRequirements: Requirement[] = [
    {
      id: `req-${Date.now()}-1`,
      jobId: '',
      category: 'document',
      title: 'Permit Application',
      description: 'Completed permit application form',
      isRequired: true,
      confidence: 1,
      status: 'pending',
      actionType: 'Fill out and upload',
      sourceUrl: 'https://pinellas.gov/topic/building-development/permits/',
      minimumCriteria: 'Signed permit form with full property address',
      whoCanHelp: 'County permit desk',
      plainLanguageWhy: 'The county needs this form to start your job review.',
      acceptedFormats: ['PDF'],
      allowsMultipleUploads: false,
      goodUploadExample: 'Signed permit form PDF with owner and contractor names'
    },
    {
      id: `req-${Date.now()}-2`,
      jobId: '',
      category: 'license',
      title: 'Contractor License',
      description: 'Valid Florida contractor license',
      isRequired: true,
      confidence: 1,
      status: 'pending',
      actionType: 'Upload proof',
      minimumCriteria: 'License is active and matches contractor business name',
      whoCanHelp: 'Florida DBPR support',
      plainLanguageWhy: 'The county checks that licensed pros do permit work.',
      acceptedFormats: ['PDF', 'JPG', 'PNG'],
      allowsMultipleUploads: false,
      goodUploadExample: 'Clear license card image with visible expiration date'
    },
    {
      id: `req-${Date.now()}-3`,
      jobId: '',
      category: 'insurance',
      title: 'Insurance Certificate',
      description: 'General liability insurance certificate',
      isRequired: true,
      confidence: 1,
      status: 'pending',
      actionType: 'Request and upload',
      minimumCriteria: 'Coverage dates include permit period',
      whoCanHelp: 'Your insurance agent',
      plainLanguageWhy: 'This shows there is coverage if job damage happens.',
      acceptedFormats: ['PDF'],
      allowsMultipleUploads: true,
      goodUploadExample: 'COI PDF listing policy number and active dates'
    }
  ];

  return {
    requirements: baseRequirements,
    estimatedTimeline: '5-10 business days',
    estimatedCost: '$150-500',
    confidenceScore: 0.6
  };
}

export async function validateDocument(
  documentType: string,
  content: string
): Promise<{ isValid: boolean; issues: string[] }> {
  const client = getOpenAIClient();
  if (!client) {
    logger.warn('OpenAI client unavailable, skipping document validation AI call', {
      documentType
    });
    return { isValid: true, issues: [] };
  }

  const prompt = `Validate this ${documentType} document. Check for:
1. Expiration dates (flag if expired or expiring soon)
2. Required signatures
3. Completeness
4. Correct form version

Document content: ${content}

Respond with JSON: { "isValid": boolean, "issues": string[] }`;

  try {
    const response = await retry(
      async () =>
        client.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' },
          temperature: 0.1
        }),
      {
        maxAttempts: 3,
        initialDelayMs: 500,
        maxDelayMs: 4000,
        backoffMultiplier: 2,
        shouldRetry: isRetryableAiError,
        onRetry: async (error, attempt, nextDelayMs) => {
          logger.warn('Retrying AI document validation request', {
            attempt,
            nextDelayMs,
            documentType,
            error: serializeError(error)
          });
        }
      }
    );

    const content = response.choices[0]?.message?.content ?? '{}';
    const parsedResult = aiDocumentValidationSchema.parse(JSON.parse(content));

    return {
      isValid: parsedResult.isValid ?? true,
      issues: parsedResult.issues ?? []
    };
  } catch (error) {
    logger.error('Document validation failed, returning permissive fallback', {
      documentType,
      error: serializeError(error)
    });
    return { isValid: true, issues: [] };
  }
}
