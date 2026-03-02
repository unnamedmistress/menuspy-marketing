import { useState } from 'react';
import { Check, Circle, AlertCircle, FileText, PenTool, ClipboardCheck, Award, Shield, DollarSign, HelpCircle, Phone } from 'lucide-react';
import { Requirement, RequirementCategory } from '@/types/permit';
import { categorizeRequirements, calculateProgress } from '@/services/requirements';
import Button from '@/components/shared/Button';

interface RequirementsDisplayProps {
  requirements: Requirement[];
  onStatusChange?: (id: string, status: Requirement['status']) => void;
  readOnly?: boolean;
}

const categoryIcons: Record<RequirementCategory, typeof FileText> = {
  document: FileText,
  drawing: PenTool,
  inspection: ClipboardCheck,
  license: Award,
  insurance: Shield,
  fee: DollarSign
};

const categoryLabels: Record<RequirementCategory, string> = {
  document: 'Documents',
  drawing: 'Drawings',
  inspection: 'Inspections',
  license: 'Licenses',
  insurance: 'Insurance',
  fee: 'Fees'
};

const STATUS_BADGES = {
  pending: 'bg-red-100 text-red-700 border-red-200',
  in_progress: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  completed: 'bg-green-100 text-green-700 border-green-200',
  not_applicable: 'bg-slate-100 text-slate-600 border-slate-200'
};

const STATUS_TEXT: Record<Requirement['status'], string> = {
  pending: 'Not started',
  in_progress: 'In progress',
  completed: 'Complete',
  not_applicable: 'N/A'
};

const reqProfile = (requirement: Requirement) => {
  const title = requirement.title.toLowerCase();
  if (title.includes('application') || title.includes('permit form')) {
    return {
      whatItIs: 'A form from the city saying what work you are doing.',
      whatYouNeed: 'We will fill this out FOR you.',
      goodNews: "Most contractors don't fill this out themselves - we do it.",
      fallbackHelp: 'Use a city template and match the address exactly.'
    };
  }
  if (title.includes('license')) {
    return {
      whatItIs: "Proof that you're legally allowed to do this work.",
      whatYouNeed: 'Your Florida license number.',
      goodNews: 'If you are working for someone else, THEY might provide this.',
      fallbackHelp: "Don't have one? Click here to learn how to get one."
    };
  }
  if (title.includes('insurance')) {
    return {
      whatItIs: 'Proof you have insurance if something goes wrong.',
      whatYouNeed: 'A 1-page document from your insurance company.',
      goodNews: 'Most jobs need $1M coverage.',
      fallbackHelp: 'Call your insurance agent and ask for an active COI.'
    };
  }
  return {
    whatItIs: requirement.plainLanguageWhy || 'A document or step the city asks for before approval.',
    whatYouNeed: requirement.minimumCriteria || 'Basic job details and clear documents.',
    goodNews: 'We break this into small, easy steps.',
    fallbackHelp: requirement.whoCanHelp || 'County permit desk can help with this item.'
  };
};

const nextStatus = (status: Requirement['status']): Requirement['status'] => {
  if (status === 'pending') return 'in_progress';
  if (status === 'in_progress') return 'completed';
  return 'pending';
};

export default function RequirementsDisplay({ requirements, onStatusChange, readOnly = false }: RequirementsDisplayProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedRequirement, setExpandedRequirement] = useState<string | null>(null);
  const [helpOpenId, setHelpOpenId] = useState<string | null>(null);

  const categorized = categorizeRequirements(requirements);
  const progress = calculateProgress(requirements);

  const handleToggleStatus = (req: Requirement) => {
    if (readOnly || !onStatusChange) return;
    onStatusChange(req.id, nextStatus(req.status));
  };

  const renderCategory = (category: RequirementCategory, items: Requirement[]) => {
    if (items.length === 0) return null;

    const Icon = categoryIcons[category];
    const isExpanded = expandedCategory === category;
    const completedCount = items.filter((r) => r.status === 'completed').length;

    return (
      <div key={category} className="mb-4 overflow-hidden rounded-xl border">
        <button
          onClick={() => setExpandedCategory(isExpanded ? null : category)}
          className="min-h-[52px] w-full bg-muted/50 p-4 transition-colors hover:bg-muted"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Icon size={20} className="text-primary" />
              <span className="font-medium">{categoryLabels[category]}</span>
              <span className="text-sm text-muted-foreground">
                ({completedCount}/{items.length})
              </span>
            </div>
            <div className="text-sm text-muted-foreground">{isExpanded ? 'Hide' : 'Show'}</div>
          </div>
        </button>

        {isExpanded && (
          <div className="space-y-3 p-4">
            {items.map((req) => {
              const isOpen = expandedRequirement === req.id;
              const details = reqProfile(req);
              return (
                <div key={req.id} className="rounded-lg border bg-card p-3">
                  <div className="flex items-start gap-3">
                    {!readOnly && onStatusChange ? (
                      <button
                        onClick={() => handleToggleStatus(req)}
                        className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded border-2 transition-colors ${
                          req.status === 'completed'
                            ? 'border-green-500 bg-green-500 text-white'
                            : req.status === 'in_progress'
                              ? 'border-yellow-500 bg-yellow-100 text-yellow-700'
                              : 'border-muted-foreground hover:border-primary'
                        }`}
                        title="Change status"
                      >
                        {req.status === 'completed' ? <Check size={12} /> : <Circle size={12} />}
                      </button>
                    ) : (
                      <div className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded border ${STATUS_BADGES[req.status]}`}>
                        {req.status === 'completed' ? <Check size={12} /> : <Circle size={12} />}
                      </div>
                    )}

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium">{req.title}</span>
                        {req.isRequired && <span className="rounded bg-red-100 px-1.5 py-0.5 text-xs font-medium text-red-700">Required</span>}
                        <span className={`rounded border px-2 py-0.5 text-xs font-medium ${STATUS_BADGES[req.status]}`}>
                          {STATUS_TEXT[req.status]}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{req.description}</p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="min-h-[44px]"
                          onClick={() => setExpandedRequirement(isOpen ? null : req.id)}
                        >
                          {isOpen ? 'Hide details' : 'Open details'}
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="min-h-[44px]"
                          onClick={() => setHelpOpenId(helpOpenId === req.id ? null : req.id)}
                          icon={<HelpCircle size={16} />}
                        >
                          Get Help
                        </Button>
                      </div>

                      {isOpen && (
                        <div className="mt-3 space-y-2 rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm">
                          <p>📋 What it is: {details.whatItIs}</p>
                          <p>🎯 What you need to do: {details.whatYouNeed}</p>
                          <p>✨ The good news: {details.goodNews}</p>
                          {req.title.toLowerCase().includes('license') && (
                            <p>❓ Don't have one? Click here to learn how to get one.</p>
                          )}
                          {req.title.toLowerCase().includes('insurance') && (
                            <>
                              <p>📞 How to get it: Call your insurance agent and say: "Please email my current certificate of insurance for permit filing."</p>
                              <p>💡 Template: We can generate a text you can send to your agent.</p>
                              <p>⚠️ Important: Most jobs need $1M coverage.</p>
                            </>
                          )}
                          {!req.title.toLowerCase().includes('insurance') && <p>💡 Pro tip: {details.fallbackHelp}</p>}
                        </div>
                      )}

                      {helpOpenId === req.id && (
                        <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
                          <p className="font-semibold">Help options</p>
                          <div className="mt-2 space-y-1">
                            <p>Video tutorial option: 2-minute walkthrough.</p>
                            <p>Template letters: ready-to-send request text.</p>
                            <p>FAQ: common permit mistakes and fixes.</p>
                            <p className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              Phone number: (727) 464-3199
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="mt-2 flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">AI Confidence: {Math.round(req.confidence * 100)}%</span>
                        {req.notes && <span className="text-xs text-blue-600">Notes added</span>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-medium">Overall Progress</span>
          <span className="text-2xl font-bold text-primary">{progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <span className="rounded border border-red-200 bg-red-100 px-2 py-0.5 text-red-700">🔴 Not started</span>
          <span className="rounded border border-yellow-200 bg-yellow-100 px-2 py-0.5 text-yellow-800">🟡 In progress</span>
          <span className="rounded border border-green-200 bg-green-100 px-2 py-0.5 text-green-700">🟢 Complete</span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {requirements.filter((r) => r.status === 'completed').length} of {requirements.length} requirements completed
        </p>
      </div>

      <div className="space-y-2">
        {renderCategory('document', categorized.documents)}
        {renderCategory('drawing', categorized.drawings)}
        {renderCategory('inspection', categorized.inspections)}
        {renderCategory('license', categorized.licenses)}
        {renderCategory('insurance', categorized.insurance)}
        {renderCategory('fee', categorized.fees)}
      </div>

      {requirements.length === 0 && (
        <div className="py-8 text-center text-muted-foreground">
          <AlertCircle size={48} className="mx-auto mb-4 opacity-50" />
          <p>No requirements found for this job.</p>
        </div>
      )}
    </div>
  );
}
