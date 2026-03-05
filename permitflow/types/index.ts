export type PermitType =
  | 'BUILDING'
  | 'ELECTRICAL'
  | 'PLUMBING'
  | 'HVAC'
  | 'FENCE'
  | 'DECK'
  | 'RENOVATION'
  | 'ADDITION';

export type PermitStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'REVIEWING'
  | 'REVISIONS'
  | 'APPROVED'
  | 'REJECTED';

export type PredictionStatus = 'PENDING' | 'ACCEPTED' | 'DISMISSED' | 'EXPIRED';

export interface Permit {
  id: string;
  title: string;
  description: string;
  type: PermitType;
  status: PermitStatus;
  estimatedDays: number;
  estimatedCost?: number;
  squareFootage?: number;
  jurisdiction: string;
  submittedAt?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Prediction {
  id: string;
  permitType: PermitType;
  confidence: number;
  triggerType: string;
  requiredDocs: string[];
  estimatedDays: number;
  rationale: string;
  status: PredictionStatus;
  createdAt: string;
}

export interface HistoricalPermit {
  id: string;
  permitType: PermitType;
  location: string;
  squareFootage?: number;
  complexity: number;
  daysToApproval: number;
  submissionMonth: number;
}

export interface ChatAction {
  label: string;
  type: 'CREATE_PERMIT' | 'STATUS_CHECK' | 'VIEW_CHECKLIST';
  payload?: Record<string, string>;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  actions?: ChatAction[];
}

export interface IntentAnalysis {
  action: string;
  structure: string;
  location?: string;
  size?: number;
  confidence: number;
  raw: string;
}

export type IntentType = 'PERMIT_INQUIRY' | 'STATUS_CHECK' | 'DOCUMENT_HELP' | 'GENERAL';
