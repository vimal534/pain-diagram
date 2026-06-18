export type BodyView = 'front' | 'back';

export type PainLevel = 'mild' | 'moderate' | 'severe';

export type ExactSpot = 'Front' | 'Inner' | 'Outer' | 'Back' | 'Deep inside';

export type PainStart =
  | 'After an injury'
  | 'Exercise or lifting'
  | 'Gradually over time'
  | 'Woke up with pain'
  | 'Not sure';

export type Duration =
  | 'Less than 24h'
  | '1–7 days'
  | '1–4 weeks'
  | '1–6 months'
  | 'More than 6 months';

export type Pattern = 'Improving' | 'Stable' | 'Worsening';

export type DailyImpact = 'None' | 'Some' | 'A lot' | 'Unable';

export type PainDescriptor =
  | 'Sharp'
  | 'Burning'
  | 'Stiffness'
  | 'Throbbing'
  | 'Tingling'
  | 'Numbness';

export interface BodyRegion {
  id: string;
  label: string;
  side: 'left' | 'right' | 'center';
  view: BodyView;
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface SelectedRegion {
  region: BodyRegion;
  exactSpot: ExactSpot | null;
  painLevel: PainLevel | null;
  // question bank answers
  starts: PainStart[];
  duration: Duration | null;
  pattern: Pattern | null;
  dailyImpact: DailyImpact | null;
  descriptors: PainDescriptor[];
}

export type AppStep = 'intro' | 'bodymap' | 'refine' | 'questions' | 'review';

export interface AppState {
  step: AppStep;
  bodyView: BodyView;
  selectedRegions: SelectedRegion[];
  editingRegionId: string | null;
}
