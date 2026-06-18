export type BodyView = 'front' | 'back';

export type PainLevel = 'mild' | 'moderate' | 'severe';

export type PainDescriptor =
  | 'Sharp'
  | 'Burning'
  | 'Stiffness'
  | 'Throbbing'
  | 'Tingling'
  | 'Numbness';

export type PainStart =
  | 'After an injury or accident'
  | 'Direct impact'
  | 'After exercise or lifting'
  | 'Woke up with it'
  | 'Gradually over time'
  | 'Not sure';

export type Duration =
  | 'Less than 24 hours'
  | '1–7 days'
  | '1–4 weeks'
  | '1–6 months'
  | 'More than 6 months';

export type Pattern = 'Improving' | 'Stable' | 'Worsening';

export type DailyImpact = 'None' | 'Some' | 'A lot' | 'Severely' | 'Unable';

export interface BodyRegion {
  id: string;
  label: string;
  side: 'left' | 'right' | 'center';
  view: BodyView;
  // click zone as percentage of body image
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface SelectedRegion {
  region: BodyRegion;
  exactSpot: string | null;
  painLevel: PainLevel | null;
  descriptors: PainDescriptor[];
}

export interface PainContextData {
  starts: PainStart[];
  duration: Duration | null;
  pattern: Pattern | null;
  dailyImpact: DailyImpact | null;
}

export interface PainDiagramState {
  step: 1 | 2 | 3;
  bodyView: BodyView;
  selectedRegions: SelectedRegion[];
  activeRegion: SelectedRegion | null;
  painContext: PainContextData;
}
