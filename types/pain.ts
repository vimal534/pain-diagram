export type PainLevel = 'mild' | 'moderate' | 'severe';
export type ExactSpot = 'Outer' | 'Inner' | 'Front' | 'Back' | 'Deep inside' | 'Near joint' | 'Near wrist' | 'Near elbow';
export type PainStart = 'After an injury' | 'Exercise or lifting' | 'Gradually over time' | 'Woke up with pain' | 'Not sure';
export type Duration = 'Less than 24h' | '1–7 days' | '1–4 weeks' | '1–6 months' | 'More than 6 months';
export type Pattern = 'Improving' | 'Stable' | 'Worsening';
export type DailyImpact = 'None' | 'Some' | 'A lot' | 'Unable';
export type PainDescriptor = 'Sharp' | 'Burning' | 'Stiffness' | 'Throbbing' | 'Tingling' | 'Numbness' | 'Weak Grip' | 'Clicking';

export interface BodyRegion {
  id: string;
  label: string;
  side: 'left' | 'right' | 'center';
  anatomyGroup: string;
  svgPath: string;      // SVG <path> d attribute
  tooltipX: number;     // SVG coordinate for tooltip anchor
  tooltipY: number;
}

export interface SelectedRegion {
  region: BodyRegion;
  exactSpot: ExactSpot | null;
  painLevel: PainLevel | null;
  descriptors: PainDescriptor[];
  aggravatingFactors: string[];
  starts: PainStart[];
  duration: Duration | null;
  pattern: Pattern | null;
  dailyImpact: DailyImpact | null;
}

export type AppStep = 'intro' | 'bodymap' | 'questions' | 'review' | 'thankyou';

export interface AppState {
  step: AppStep;
  selectedRegions: SelectedRegion[];
  editingRegionId: string | null;
  editSource: 'bodymap' | 'review' | null;
  successToast: string | null;
}

export const makeEmptyRegion = (region: BodyRegion): SelectedRegion => ({
  region,
  exactSpot: null,
  painLevel: null,
  descriptors: [],
  aggravatingFactors: [],
  starts: [],
  duration: null,
  pattern: null,
  dailyImpact: null,
});
