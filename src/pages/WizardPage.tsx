import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, FileText, CheckCircle, Clock, AlertCircle, ExternalLink, Phone, Printer, MessageCircle, Users, Rocket } from 'lucide-react';
import PageWrapper from '@/components/layout/PageWrapper';
import Button from '@/components/shared/Button';
import RequirementsDisplay from '@/components/requirements/RequirementsDisplay';
import { getJobFromMemory } from './NewJobPage';
import { Job, Requirement } from '@/types/permit';
import { calculateProgress } from '@/services/requirements';
import {
  CLEARWATER_BUILDING_DEPT,
  LARGO_BUILDING_DEPT,
  PINELLAS_COUNTY_BUILDING,
  ST_PETE_BUILDING_DEPT,
  formatPhoneLink
} from '@/data/jurisdictionData';

const jurisdictionDepartmentMap = {
  PINELLAS_COUNTY: PINELLAS_COUNTY_BUILDING,
  ST_PETERSBURG: ST_PETE_BUILDING_DEPT,
  CLEARWATER: CLEARWATER_BUILDING_DEPT,
  LARGO: LARGO_BUILDING_DEPT,
  PALM_HARBOR: PINELLAS_COUNTY_BUILDING
} as const;

const permitJourneyStages = [
  { icon: '✅', title: 'Create job (you just did this)', duration: 'Done now' },
  { icon: '📄', title: 'Get your documents', duration: '1-3 days' },
  { icon: '🚀', title: 'Submit to city (we will show you how)', duration: '30-60 min' },
  { icon: '⏳', title: 'Wait for approval', duration: '2-4 weeks' },
  { icon: '✅', title: "You're approved!", duration: 'Final step' }
];

const JOB_BREAKDOWN: Partial<Record<Job['jobType'], { timeline: string; permitFee: string }>> = {
  WATER_HEATER: { timeline: 'Usually takes 1-2 weeks', permitFee: 'Permit fee: ~$50-130' },
  RE_ROOFING: { timeline: 'Usually takes 2-4 weeks', permitFee: 'Permit fee: ~$75-180' },
  ELECTRICAL_PANEL: { timeline: 'Usually takes 1-3 weeks', permitFee: 'Permit fee: ~$65-180' },
  AC_HVAC_CHANGEOUT: { timeline: 'Usually takes 1-2 weeks', permitFee: 'Permit fee: ~$60-150' }
};

export default function WizardPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!jobId) {
      navigate('/new');
      return;
    }

    const foundJob = getJobFromMemory(jobId);
    if (foundJob) {
      setJob(foundJob);
    } else {
      toast.error('Job not found');
      navigate('/new');
    }
    setLoading(false);
  }, [jobId, navigate]);

  const handleRequirementStatusChange = (reqId: string, status: Requirement['status']) => {
    if (!job) return;

    const updatedRequirements = job.requirements.map((r) => (r.id === reqId ? { ...r, status } : r));
    const updatedJob = { ...job, requirements: updatedRequirements };
    setJob(updatedJob);
  };

  const getStatusIcon = (status: Job['status']) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'submitted':
      case 'under_review':
        return <Clock className="text-blue-500" size={20} />;
      case 'rejected':
        return <AlertCircle className="text-red-500" size={20} />;
      default:
        return <FileText className="text-muted-foreground" size={20} />;
    }
  };

  const getStatusLabel = (status: Job['status']) => {
    const labels: Record<Job['status'], string> = {
      draft: 'Draft',
      requirements_pending: 'Requirements Pending',
      documents_pending: 'Documents Pending',
      ready_to_submit: 'Ready to Submit',
      submitted: 'Submitted',
      under_review: 'Under Review',
      approved: 'Approved',
      rejected: 'Rejected',
      closed: 'Closed'
    };
    return labels[status];
  };

  if (loading) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </PageWrapper>
    );
  }

  if (!job) return null;

  const progress = calculateProgress(job.requirements);
  const department = jurisdictionDepartmentMap[job.jurisdiction] || PINELLAS_COUNTY_BUILDING;
  const jobBreakdown = JOB_BREAKDOWN[job.jobType] || { timeline: 'Usually takes 2-4 weeks', permitFee: 'Permit fee: ~$50-150' };

  return (
    <PageWrapper hasBottomNav={false}>
      <header className="border-b bg-card">
        <div className="container max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              <ArrowLeft size={18} className="mr-2" />
              Back
            </Button>

            <div className="flex-1">
              <h1 className="text-xl font-semibold">{job.jobType.replace(/_/g, ' ')}</h1>
              <p className="text-sm text-muted-foreground">{job.address}</p>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted">
              {getStatusIcon(job.status)}
              <span className="text-sm font-medium">{getStatusLabel(job.status)}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container max-w-5xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-xl border bg-card">
              <h2 className="text-lg font-semibold mb-4">Requirements Checklist</h2>
              <RequirementsDisplay requirements={job.requirements} onStatusChange={handleRequirementStatusChange} />
            </div>

            <div className="p-6 rounded-xl border bg-card">
              <h2 className="text-lg font-semibold mb-2">Requirements Breakdown</h2>
              <p className="text-sm text-muted-foreground">What's normal for this job:</p>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                  <p className="text-sm font-medium">Timeline estimate</p>
                  <p className="text-sm text-muted-foreground">{jobBreakdown.timeline}</p>
                </div>
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                  <p className="text-sm font-medium">Cost estimate</p>
                  <p className="text-sm text-muted-foreground">{jobBreakdown.permitFee} (excludes work cost)</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl border bg-card">
              <h2 className="text-lg font-semibold mb-4">Better Next Steps Timeline</h2>
              <div className="space-y-4">
                {permitJourneyStages.map((stage) => (
                  <div key={stage.title} className="flex gap-3">
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-muted text-sm font-semibold">
                      {stage.icon}
                    </div>
                    <div>
                      <p className="font-medium">{stage.title}</p>
                      <p className="text-xs text-primary mt-0.5">{stage.duration}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (department.onlinePortal || department.website) {
                      window.open(department.onlinePortal || department.website, '_blank', 'noopener,noreferrer');
                    }
                  }}
                >
                  <ExternalLink size={16} className="mr-1" />
                  Open county application
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    window.location.href = formatPhoneLink(department.phone);
                  }}
                >
                  <Phone size={16} className="mr-1" />
                  Call permit desk
                </Button>
                <Button variant="outline" size="sm" onClick={() => window.print()}>
                  <Printer size={16} className="mr-1" />
                  Print checklist
                </Button>
              </div>
            </div>

            <div className="p-6 rounded-xl border bg-card">
              <h2 className="text-lg font-semibold mb-4">Next Steps</h2>
              {progress < 100 ? (
                <div className="space-y-4">
                  <p className="text-muted-foreground">Complete all required checklist items before county submission.</p>
                  <div className="flex items-center gap-2 text-sm">
                    <AlertCircle size={16} className="text-amber-500" />
                    <span>{job.requirements.filter((r) => r.status !== 'completed' && r.isRequired).length} required items remaining</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-green-600 flex items-center gap-2">
                    <CheckCircle size={20} />
                    All requirements completed. Ready to submit.
                  </p>
                  <Button className="w-full" size="lg">
                    Submit Permit Application
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-4 rounded-xl border bg-card">
              <h3 className="font-medium mb-3">Job Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium text-right">{job.jobType.replace(/_/g, ' ')}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground">Jurisdiction</span>
                  <span className="font-medium text-right">{job.jurisdiction.replace(/_/g, ' ')}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground">Created</span>
                  <span className="font-medium">{job.createdAt.toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border bg-card">
              <h3 className="font-medium mb-3">Documents</h3>
              {job.documents.length === 0 ? (
                <p className="text-sm text-muted-foreground">No documents uploaded yet</p>
              ) : (
                <div className="space-y-2">
                  {job.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center gap-2 text-sm">
                      <FileText size={16} className="text-muted-foreground" />
                      <span className="truncate">{doc.name}</span>
                    </div>
                  ))}
                </div>
              )}
              <Button variant="outline" size="sm" className="w-full mt-3">
                Upload Document
              </Button>
            </div>

            <div className="p-4 rounded-xl border bg-blue-50 border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-3">Need Help?</h3>
              <div className="space-y-2 text-sm text-blue-900">
                <a
                  className="flex min-h-[44px] items-center gap-2 rounded-lg border border-blue-200 bg-white px-3 py-2 hover:bg-blue-100"
                  href={formatPhoneLink('(727) 464-3199')}
                >
                  <Phone size={16} />
                  <span>Call County: (727) 464-3199 (Mon-Fri 8am-5pm)</span>
                </a>
                <button className="flex min-h-[44px] w-full items-center gap-2 rounded-lg border border-blue-200 bg-white px-3 py-2 text-left hover:bg-blue-100">
                  <MessageCircle size={16} />
                  <span>Chat with our AI: Ask anything about your permit</span>
                </button>
                <button className="flex min-h-[44px] w-full items-center gap-2 rounded-lg border border-blue-200 bg-white px-3 py-2 text-left hover:bg-blue-100">
                  <Users size={16} />
                  <span>Hire someone: Pre-vetted local permit specialists</span>
                </button>
                <a
                  className="flex min-h-[44px] items-center gap-2 rounded-lg border border-blue-200 bg-white px-3 py-2 hover:bg-blue-100"
                  href={department.website || department.onlinePortal}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Rocket size={16} />
                  <span>County website and forms</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
