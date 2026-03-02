import { useMemo, useState } from 'react';
import { ArrowRight, ArrowLeft, Check, AlertCircle, Camera, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { JobType, Jurisdiction, Requirement } from '@/types/permit';
import { getRequirementsForJob } from '@/services/requirements';
import Button from '@/components/shared/Button';
import JobTypeDropdown, { JOB_TYPE_OPTIONS } from '@/components/jobs/JobTypeDropdown';

export type CreateJobState = 'idle' | 'creating' | 'created' | 'failed';

interface SmartWizardProps {
  onComplete: (data: WizardData) => void;
  createState?: CreateJobState;
  createError?: string | null;
  onRetryCreate?: () => void;
  initialData?: Partial<WizardData>;
}

export interface WizardData {
  jobType: JobType;
  jurisdiction: Jurisdiction;
  address: string;
  description: string;
  requirements: Requirement[];
}

const JURISDICTIONS: { value: Jurisdiction; label: string; helper: string }[] = [
  { value: 'PINELLAS_COUNTY', label: 'Pinellas County - areas outside cities', helper: 'County rules outside city limits' },
  { value: 'ST_PETERSBURG', label: 'St. Petersburg', helper: 'City of St. Petersburg permit office' },
  { value: 'CLEARWATER', label: 'Clearwater', helper: 'City of Clearwater permit office' },
  { value: 'LARGO', label: 'Largo', helper: 'City of Largo permit office' },
  { value: 'PALM_HARBOR', label: 'Palm Harbor', helper: 'Palm Harbor service area' }
];

const ADDRESS_SUGGESTIONS = [
  '123 Main St, St Petersburg, FL 33710',
  '4501 4th St N, St Petersburg, FL 33703',
  '812 Oak Ave, Clearwater, FL 33755',
  '995 Gulf Blvd, Largo, FL 33770',
  'Corner of Main and Oak, Clearwater, FL'
];

const GUIDED_QUESTIONS: Partial<Record<JobType, string[]>> = {
  WATER_HEATER: ['What brand?', 'How many gallons?', 'Gas or electric?'],
  RE_ROOFING: ['How many squares?', 'What material?', 'Single or multi-story?'],
  ROOF_REPAIR: ['Where is the leak?', 'What material?', 'Single or multi-story?'],
  ELECTRICAL_PANEL: ['Current panel amps?', 'New panel amps?', 'Any new circuits?']
};

const DESCRIPTION_EXAMPLES: Partial<Record<JobType, string[]>> = {
  WATER_HEATER: [
    'Replace 40-gallon electric Rheem with 50-gallon electric AO Smith in same garage spot.',
    'Swap old gas tank for new 40-gallon gas unit. No layout change.'
  ],
  RE_ROOFING: [
    'Remove existing shingles. Install architectural shingles on 24 squares, single-story home.',
    'Tear off old roof and install metal roof on 18 squares, two-story home.'
  ],
  ELECTRICAL_PANEL: [
    'Replace 100-amp panel with 200-amp panel and add two kitchen circuits.',
    'Upgrade damaged panel to modern 150-amp panel in same location.'
  ]
};

export default function SmartWizard({
  onComplete,
  createState = 'idle',
  createError,
  onRetryCreate,
  initialData
}: SmartWizardProps) {
  const getInitialStep = () => {
    if (initialData?.requirements?.length) return 4;
    if (initialData?.address) return 3;
    if (initialData?.jurisdiction) return 2;
    return 1;
  };

  const [step, setStep] = useState(getInitialStep);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [data, setData] = useState<Partial<WizardData>>({
    jobType: initialData?.jobType,
    jurisdiction: initialData?.jurisdiction,
    address: initialData?.address || '',
    description: initialData?.description || ''
  });
  const [requirements, setRequirements] = useState<Requirement[]>(initialData?.requirements || []);
  const [addressVerified, setAddressVerified] = useState(false);
  const [propertyPhotoName, setPropertyPhotoName] = useState<string>('');
  const [issuePhotoName, setIssuePhotoName] = useState<string>('');
  const [guidedAnswers, setGuidedAnswers] = useState<Record<string, string>>({});
  const totalSteps = 4;

  const requiredCount = requirements.filter((req) => req.isRequired).length;
  const optionalCount = requirements.length - requiredCount;

  const filteredAddressSuggestions = useMemo(() => {
    const raw = (data.address || '').trim().toLowerCase();
    if (raw.length < 2) return [];
    return ADDRESS_SUGGESTIONS.filter((suggestion) => suggestion.toLowerCase().includes(raw)).slice(0, 4);
  }, [data.address]);

  const guidedQuestions = data.jobType ? GUIDED_QUESTIONS[data.jobType] || [] : [];
  const descriptionExamples = data.jobType ? DESCRIPTION_EXAMPLES[data.jobType] || [] : [];

  const buildGuidedDescription = () => {
    const parts = guidedQuestions
      .map((question) => {
        const answer = guidedAnswers[question];
        return answer ? `${question} ${answer}` : '';
      })
      .filter(Boolean);
    return parts.join('. ');
  };

  const handleNext = async () => {
    if (step === 3) {
      await analyzeRequirements();
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const analyzeRequirements = async () => {
    if (!data.jobType || !data.jurisdiction || !data.address) {
      toast.error('Please fill in all required fields');
      return;
    }

    const mergedDescription = (data.description || '').trim() || buildGuidedDescription();

    setIsAnalyzing(true);
    try {
      const reqs = await getRequirementsForJob(
        data.jobType,
        data.jurisdiction,
        data.address,
        mergedDescription
      );
      setRequirements(reqs);
      setStep(4);
      toast.success('Requirements analyzed', {
        description: `Found ${reqs.length} checklist items`
      });
    } catch {
      toast.error('Failed to analyze requirements');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleComplete = () => {
    if (!data.jobType || !data.jurisdiction || !data.address) {
      toast.error('Please fill in all required fields');
      return;
    }

    onComplete({
      jobType: data.jobType,
      jurisdiction: data.jurisdiction,
      address: data.address,
      description: (data.description || '').trim() || buildGuidedDescription(),
      requirements
    });
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return !!data.jobType;
      case 2:
        return !!data.jurisdiction;
      case 3:
        return (data.address || '').length > 5 && addressVerified;
      case 4:
        return requirements.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {createState === 'failed' && createError && (
        <div className="mb-6 rounded-xl border border-red-300 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 text-red-600" />
            <div className="flex-1">
              <p className="font-semibold text-red-700">We could not open your checklist.</p>
              <p className="mt-1 text-sm text-red-700">{createError}</p>
            </div>
            <Button variant="outline" size="sm" onClick={onRetryCreate}>
              Retry
            </Button>
          </div>
        </div>
      )}

      <div className="mb-8">
        <div className="mb-2 flex justify-between">
          {['Job Type', 'Location', 'Details', 'Requirements'].map((label, index) => (
            <div
              key={label}
              className={`text-xs font-medium ${index + 1 <= step ? 'text-primary' : 'text-muted-foreground'}`}
            >
              {label}
            </div>
          ))}
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-primary transition-all duration-300" style={{ width: `${(step / totalSteps) * 100}%` }} />
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">What type of job?</h2>
          <p className="text-muted-foreground">Pick the job. We explain each one.</p>
          <JobTypeDropdown
            value={data.jobType}
            onChange={(jobType) => setData({ ...data, jobType })}
            options={JOB_TYPE_OPTIONS}
          />
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Where is this job?</h2>
          <p className="text-muted-foreground">This tells us which city's rules to follow.</p>

          <div className="space-y-3">
            {JURISDICTIONS.map((jurisdiction) => (
              <button
                key={jurisdiction.value}
                onClick={() => setData({ ...data, jurisdiction: jurisdiction.value })}
                className={`min-h-[56px] w-full rounded-xl border-2 p-4 text-left transition-all ${
                  data.jurisdiction === jurisdiction.value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="font-medium">{jurisdiction.label}</div>
                <div className="text-sm text-muted-foreground">{jurisdiction.helper}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-5">
          <h2 className="text-xl font-semibold">Property + Job Details</h2>

          <div>
            <label className="mb-2 block text-sm font-medium">Property Address *</label>
            <input
              type="text"
              value={data.address}
              onChange={(e) => {
                setData({ ...data, address: e.target.value });
                setAddressVerified(false);
              }}
              placeholder="123 Main St, St Petersburg, FL 33710"
              className="min-h-[52px] w-full rounded-xl border bg-background px-4 py-3"
            />
            <p className="mt-2 text-sm text-muted-foreground">Don't know the exact address? Use "corner of Main and Oak".</p>
            {filteredAddressSuggestions.length > 0 && (
              <div className="mt-2 rounded-xl border bg-card p-2">
                <p className="px-2 pb-1 text-xs font-medium text-muted-foreground">Address suggestions</p>
                <div className="space-y-1">
                  {filteredAddressSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => {
                        setData({ ...data, address: suggestion });
                        setAddressVerified(false);
                      }}
                      className="min-h-[44px] w-full rounded-lg px-2 text-left text-sm hover:bg-muted"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <label className="flex min-h-[44px] cursor-pointer items-center gap-2 rounded-lg border bg-card px-3 py-2">
            <input
              type="checkbox"
              checked={addressVerified}
              onChange={(e) => setAddressVerified(e.target.checked)}
              className="h-4 w-4"
            />
            <span className="text-sm font-medium">Is this your property?</span>
          </label>

          <div className="rounded-xl border bg-card p-3">
            <label className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-lg border border-primary/25 bg-primary/5 px-3 py-2 text-sm font-medium text-primary">
              <Camera className="h-4 w-4" />
              Optional: Take a photo of the property
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setPropertyPhotoName(file ? file.name : '');
                }}
              />
            </label>
            {propertyPhotoName && <p className="mt-2 text-xs text-muted-foreground">Attached: {propertyPhotoName}</p>}
          </div>

          <div className="rounded-xl border bg-card p-4">
            <h3 className="font-semibold">Describe the work</h3>
            <p className="mt-1 text-sm text-muted-foreground">Answer these quick questions.</p>
            {guidedQuestions.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">No guided questions for this job yet. Use the text box below.</p>
            ) : (
              <div className="mt-3 space-y-3">
                {guidedQuestions.map((question) => (
                  <div key={question}>
                    <label className="mb-1 block text-sm font-medium">{question}</label>
                    <input
                      type="text"
                      value={guidedAnswers[question] || ''}
                      onChange={(e) =>
                        setGuidedAnswers((prev) => ({
                          ...prev,
                          [question]: e.target.value
                        }))
                      }
                      className="min-h-[44px] w-full rounded-lg border bg-background px-3 py-2"
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium">Job Description (Optional)</label>
              <textarea
                value={data.description}
                onChange={(e) => setData({ ...data, description: e.target.value })}
                placeholder="Add extra details here..."
                rows={4}
                className="w-full resize-none rounded-xl border bg-background px-4 py-3"
              />
              {buildGuidedDescription() && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Auto summary we can use: {buildGuidedDescription()}
                </p>
              )}
            </div>

            <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3">
              <p className="text-sm font-semibold text-green-700">Here's what good descriptions look like:</p>
              <div className="mt-2 space-y-1">
                {(descriptionExamples.length > 0 ? descriptionExamples : ['Replace old equipment with new unit in same location. Include size and type.']).map((example) => (
                  <p key={example} className="flex items-start gap-2 text-sm text-green-700">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{example}</span>
                  </p>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-xl border bg-card p-3">
              <label className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-lg border border-primary/25 bg-primary/5 px-3 py-2 text-sm font-medium text-primary">
                <Camera className="h-4 w-4" />
                Take a photo of what needs fixing
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    setIssuePhotoName(file ? file.name : '');
                  }}
                />
              </label>
              {issuePhotoName && <p className="mt-2 text-xs text-muted-foreground">Attached: {issuePhotoName}</p>}
            </div>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your permit requirements</h2>
          <p className="text-muted-foreground">Here is your checklist based on this job.</p>

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
            <div className="font-medium text-primary">Click Create Job to open your checklist page.</div>
            <p className="mt-1 text-sm text-muted-foreground">
              {requiredCount} required, {optionalCount} optional
            </p>
          </div>

          <div className="max-h-96 space-y-2 overflow-y-auto">
            {requirements.map((req, index) => (
              <div key={req.id} className="rounded-lg border bg-card p-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`h-6 w-6 rounded-full text-xs font-medium flex items-center justify-center ${
                      req.isRequired ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{req.title}</div>
                    <div className="text-sm text-muted-foreground">{req.description}</div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="rounded bg-muted px-2 py-0.5 text-xs capitalize">{req.category}</span>
                      {req.isRequired && <span className="text-xs text-red-500">Required</span>}
                      <span className="text-xs text-muted-foreground">{Math.round(req.confidence * 100)}% confidence</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
        <Button variant="secondary" onClick={handleBack} disabled={step === 1 || createState === 'creating'} className="min-h-[44px]">
          <ArrowLeft size={18} className="mr-2" />
          Back
        </Button>

        {step < 4 ? (
          <Button onClick={handleNext} disabled={!canProceed() || isAnalyzing} loading={isAnalyzing} className="min-h-[44px]">
            {isAnalyzing ? 'Analyzing...' : 'Next'}
            <ArrowRight size={18} className="ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleComplete}
            variant="primary"
            loading={createState === 'creating'}
            disabled={createState === 'created'}
            className="min-h-[44px]"
          >
            <Check size={18} className="mr-2" />
            {createState === 'created' ? 'Job Created' : 'Create Job'}
          </Button>
        )}
      </div>
    </div>
  );
}
