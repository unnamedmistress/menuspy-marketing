import { Check, Clock3, Droplets, DollarSign, House, Wrench, Zap, Wind, Fence, Building2, Paintbrush } from 'lucide-react';
import { JobType } from '@/types/permit';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

export interface JobTypeOption {
  value: JobType;
  label: string;
  description: string;
  timeline: string;
  permitFee: string;
  colorClass: string;
  icon: typeof House;
}

interface JobTypeDropdownProps {
  value?: JobType;
  onChange: (value: JobType) => void;
  options: JobTypeOption[];
}

const JOB_GROUP_LABELS: Record<string, string> = {
  roof: 'Roof + Exterior',
  mechanical: 'HVAC + Plumbing',
  electrical: 'Electrical + Power',
  remodel: 'Remodel + Structural'
};

const groupForType = (type: JobType) => {
  if (['RE_ROOFING', 'ROOF_REPAIR', 'WINDOW_DOOR_REPLACEMENT', 'SIDING_EXTERIOR', 'FENCE_INSTALLATION', 'DECK_INSTALLATION', 'POOL_BARRIER'].includes(type)) {
    return 'roof';
  }
  if (['AC_HVAC_CHANGEOUT', 'WATER_HEATER', 'PLUMBING_MAIN_LINE'].includes(type)) {
    return 'mechanical';
  }
  if (['ELECTRICAL_PANEL', 'ELECTRICAL_REWIRING', 'EV_CHARGER', 'GENERATOR_INSTALL'].includes(type)) {
    return 'electrical';
  }
  return 'remodel';
};

export default function JobTypeDropdown({ value, onChange, options }: JobTypeDropdownProps) {
  const selected = options.find((option) => option.value === value);
  const grouped = options.reduce<Record<string, JobTypeOption[]>>((acc, option) => {
    const group = groupForType(option.value);
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(option);
    return acc;
  }, {});

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
        <p className="text-sm text-muted-foreground">Pick one job type.</p>
        <p className="text-base font-semibold text-foreground">{selected ? selected.label : 'No job picked yet'}</p>
      </div>

      {Object.entries(grouped).map(([groupKey, groupOptions]) => (
        <div key={groupKey} className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{JOB_GROUP_LABELS[groupKey]}</p>
          <div className="grid grid-cols-1 gap-2">
            {groupOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = value === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onChange(option.value)}
                  className={`min-h-[56px] w-full rounded-xl border-2 px-3 py-3 text-left transition-all ${
                    isSelected ? 'border-primary bg-primary/10 shadow-sm' : 'border-border bg-card hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${option.colorClass}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold leading-tight">{option.label}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground leading-tight">{option.description}</p>
                      <HoverCard openDelay={120}>
                        <HoverCardTrigger asChild>
                          <span className="mt-2 inline-flex min-h-[44px] items-center rounded-lg border border-primary/25 bg-primary/5 px-2.5 text-xs font-medium text-primary">
                            How long + permit fee
                          </span>
                        </HoverCardTrigger>
                        <HoverCardContent align="start" className="w-72">
                          <div className="space-y-2 text-sm">
                            <p className="font-semibold">Quick estimate</p>
                            <p className="flex items-start gap-2">
                              <Clock3 className="mt-0.5 h-4 w-4 text-primary" />
                              <span>Usually takes: {option.timeline}</span>
                            </p>
                            <p className="flex items-start gap-2">
                              <DollarSign className="mt-0.5 h-4 w-4 text-primary" />
                              <span>Permit fee: {option.permitFee}</span>
                            </p>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    </div>
                    <div className="mt-1">
                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                          isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/40'
                        }`}
                      >
                        {isSelected && <Check className="h-4 w-4" />}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export const JOB_TYPE_OPTIONS: JobTypeOption[] = [
  {
    value: 'RE_ROOFING',
    label: 'Roof Replacement',
    description: 'Taking off old roof and putting on new one',
    timeline: '2-4 weeks',
    permitFee: '~$75-$180',
    colorClass: 'bg-orange-100 text-orange-700',
    icon: House
  },
  {
    value: 'ROOF_REPAIR',
    label: 'Roof Repair',
    description: 'Fixing leaks or damaged roof sections',
    timeline: '1-3 weeks',
    permitFee: '~$50-$140',
    colorClass: 'bg-amber-100 text-amber-700',
    icon: House
  },
  {
    value: 'AC_HVAC_CHANGEOUT',
    label: 'AC/HVAC Replacement',
    description: 'Removing old AC and installing a new unit',
    timeline: '1-2 weeks',
    permitFee: '~$60-$150',
    colorClass: 'bg-cyan-100 text-cyan-700',
    icon: Wind
  },
  {
    value: 'WATER_HEATER',
    label: 'Water Heater',
    description: 'Replacing or installing a water heater',
    timeline: '1-2 weeks',
    permitFee: '~$50-$130',
    colorClass: 'bg-blue-100 text-blue-700',
    icon: Droplets
  },
  {
    value: 'PLUMBING_MAIN_LINE',
    label: 'Plumbing Main Line',
    description: 'Replacing the main water or sewer line',
    timeline: '2-4 weeks',
    permitFee: '~$90-$220',
    colorClass: 'bg-sky-100 text-sky-700',
    icon: Droplets
  },
  {
    value: 'SMALL_BATH_REMODEL',
    label: 'Bathroom Remodel',
    description: 'Updating sink, toilet, shower, or tile',
    timeline: '2-6 weeks',
    permitFee: '~$80-$220',
    colorClass: 'bg-indigo-100 text-indigo-700',
    icon: Paintbrush
  },
  {
    value: 'ELECTRICAL_PANEL',
    label: 'Electrical Panel',
    description: 'Upgrading or replacing breaker panel',
    timeline: '1-3 weeks',
    permitFee: '~$65-$180',
    colorClass: 'bg-yellow-100 text-yellow-700',
    icon: Zap
  },
  {
    value: 'ELECTRICAL_REWIRING',
    label: 'Electrical Rewiring',
    description: 'Replacing old wiring with new wiring',
    timeline: '2-6 weeks',
    permitFee: '~$90-$250',
    colorClass: 'bg-yellow-100 text-yellow-700',
    icon: Zap
  },
  {
    value: 'EV_CHARGER',
    label: 'EV Charger',
    description: 'Installing a home car charger outlet',
    timeline: '1-2 weeks',
    permitFee: '~$60-$140',
    colorClass: 'bg-lime-100 text-lime-700',
    icon: Zap
  },
  {
    value: 'GENERATOR_INSTALL',
    label: 'Generator Install',
    description: 'Adding backup generator and transfer switch',
    timeline: '2-5 weeks',
    permitFee: '~$90-$240',
    colorClass: 'bg-violet-100 text-violet-700',
    icon: Zap
  },
  {
    value: 'WINDOW_DOOR_REPLACEMENT',
    label: 'Window or Door',
    description: 'Replacing old windows or exterior doors',
    timeline: '2-4 weeks',
    permitFee: '~$70-$190',
    colorClass: 'bg-green-100 text-green-700',
    icon: Wrench
  },
  {
    value: 'SIDING_EXTERIOR',
    label: 'Siding / Exterior',
    description: 'Changing exterior wall covering',
    timeline: '2-5 weeks',
    permitFee: '~$80-$200',
    colorClass: 'bg-emerald-100 text-emerald-700',
    icon: Building2
  },
  {
    value: 'DECK_INSTALLATION',
    label: 'Deck Installation',
    description: 'Building a new outdoor deck',
    timeline: '2-6 weeks',
    permitFee: '~$90-$250',
    colorClass: 'bg-teal-100 text-teal-700',
    icon: Wrench
  },
  {
    value: 'FENCE_INSTALLATION',
    label: 'Fence Installation',
    description: 'Installing a new fence around property',
    timeline: '1-3 weeks',
    permitFee: '~$50-$150',
    colorClass: 'bg-emerald-100 text-emerald-700',
    icon: Fence
  },
  {
    value: 'POOL_BARRIER',
    label: 'Pool Barrier',
    description: 'Putting safety fence around a pool',
    timeline: '1-2 weeks',
    permitFee: '~$40-$120',
    colorClass: 'bg-fuchsia-100 text-fuchsia-700',
    icon: Fence
  },
  {
    value: 'KITCHEN_REMODEL',
    label: 'Kitchen Remodel',
    description: 'Changing cabinets, counters, or layout',
    timeline: '3-8 weeks',
    permitFee: '~$100-$300',
    colorClass: 'bg-rose-100 text-rose-700',
    icon: Paintbrush
  },
  {
    value: 'ROOM_ADDITION',
    label: 'Room Addition',
    description: 'Adding a new room to the home',
    timeline: '6-12 weeks',
    permitFee: '~$150-$500',
    colorClass: 'bg-rose-100 text-rose-700',
    icon: Building2
  },
  {
    value: 'FOUNDATION_REPAIR',
    label: 'Foundation Repair',
    description: 'Fixing settlement or structural cracks',
    timeline: '3-8 weeks',
    permitFee: '~$120-$350',
    colorClass: 'bg-slate-100 text-slate-700',
    icon: Building2
  }
];
