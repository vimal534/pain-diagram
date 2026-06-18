import React, { useState } from 'react';
import {
  PainDiagramState,
  BodyRegion,
  SelectedRegion,
  BodyView,
  PainContextData,
} from '../../types/pain';
import BodyMapScreen from './BodyMapScreen';
import PainDetailSheet from './PainDetailSheet';
import PainContextScreen from './PainContextScreen';

const initialContext: PainContextData = {
  starts: [],
  duration: null,
  pattern: null,
  dailyImpact: null,
};

const initialState: PainDiagramState = {
  step: 1,
  bodyView: 'front',
  selectedRegions: [],
  activeRegion: null,
  painContext: initialContext,
};

interface Props {
  onComplete?: (state: PainDiagramState) => void;
  onBack?: () => void;
}

export default function PainDiagram({ onComplete, onBack }: Props) {
  const [state, setState] = useState<PainDiagramState>(initialState);

  const handleRegionTap = (region: BodyRegion) => {
    const existing = state.selectedRegions.find((r) => r.region.id === region.id);
    const activeRegion: SelectedRegion = existing ?? {
      region,
      exactSpot: null,
      painLevel: null,
      descriptors: [],
    };
    setState((s) => ({
      ...s,
      activeRegion,
      step: 1, // stay on step 1, sheet opens over it
    }));
  };

  const handleSheetUpdate = (updated: SelectedRegion) => {
    setState((s) => {
      const exists = s.selectedRegions.some((r) => r.region.id === updated.region.id);
      return {
        ...s,
        activeRegion: updated,
        selectedRegions: exists
          ? s.selectedRegions.map((r) => (r.region.id === updated.region.id ? updated : r))
          : [...s.selectedRegions, updated],
      };
    });
  };

  const handleSheetRemove = () => {
    setState((s) => ({
      ...s,
      activeRegion: null,
      selectedRegions: s.selectedRegions.filter(
        (r) => r.region.id !== s.activeRegion?.region.id
      ),
    }));
  };

  const handleSheetClose = () => {
    setState((s) => ({ ...s, activeRegion: null }));
  };

  const handleSheetNext = () => {
    setState((s) => ({ ...s, activeRegion: null, step: 3 }));
  };

  const handleViewToggle = (view: BodyView) => {
    setState((s) => ({ ...s, bodyView: view }));
  };

  const handleContextChange = (ctx: PainContextData) => {
    setState((s) => ({ ...s, painContext: ctx }));
  };

  const handleRemoveRegion = (regionId: string) => {
    setState((s) => ({
      ...s,
      selectedRegions: s.selectedRegions.filter((r) => r.region.id !== regionId),
    }));
  };

  const handleSubmit = () => {
    onComplete?.(state);
  };

  const handleBack = () => {
    if (state.step === 3) {
      setState((s) => ({ ...s, step: 1 }));
    } else {
      onBack?.();
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
      }}
    >
      {/* Screen 1: Body Map (always rendered as base) */}
      {state.step !== 3 && (
        <div style={{ position: 'absolute', inset: 0 }}>
          <BodyMapScreen
            bodyView={state.bodyView}
            selectedRegions={state.selectedRegions}
            onViewToggle={handleViewToggle}
            onRegionTap={handleRegionTap}
            onBack={handleBack}
          />
        </div>
      )}

      {/* Screen 2: Pain Detail Sheet (slides over Screen 1) */}
      {state.step !== 3 && state.activeRegion && (
        <PainDetailSheet
          region={state.activeRegion}
          onUpdate={handleSheetUpdate}
          onRemove={handleSheetRemove}
          onNext={handleSheetNext}
          onClose={handleSheetClose}
        />
      )}

      {/* Screen 3: Pain Context */}
      {state.step === 3 && (
        <div style={{ position: 'absolute', inset: 0 }}>
          <PainContextScreen
            selectedRegions={state.selectedRegions}
            context={state.painContext}
            onContextChange={handleContextChange}
            onBack={handleBack}
            onSubmit={handleSubmit}
            onRemoveRegion={handleRemoveRegion}
          />
        </div>
      )}
    </div>
  );
}
