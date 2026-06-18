import React, { useState } from 'react';
import { AppState, AppStep, BodyRegion, SelectedRegion } from '../../types/pain';
import IntroScreen from './IntroScreen';
import BodyMapScreen, { BODY_REGIONS } from './BodyMapScreen';
import RefineSheet from './RefineSheet';
import QuestionsScreen from './QuestionsScreen';
import ReviewScreen from './ReviewScreen';

const emptyRegion = (region: BodyRegion): SelectedRegion => ({
  region,
  exactSpot: null,
  painLevel: null,
  starts: [],
  duration: null,
  pattern: null,
  dailyImpact: null,
  descriptors: [],
});

const initial: AppState = {
  step: 'intro',
  bodyView: 'front',
  selectedRegions: [],
  editingRegionId: null,
};

interface Props {
  onComplete?: (regions: SelectedRegion[]) => void;
}

export default function PainDiagram({ onComplete }: Props) {
  const [state, setState] = useState<AppState>(initial);
  const [pendingRegion, setPendingRegion] = useState<SelectedRegion | null>(null);

  const editing = state.editingRegionId
    ? state.selectedRegions.find((r) => r.region.id === state.editingRegionId) ?? null
    : null;

  // Tap a body region → open refine sheet
  const handleRegionTap = (region: BodyRegion) => {
    const existing = state.selectedRegions.find((r) => r.region.id === region.id);
    const sr = existing ?? emptyRegion(region);
    setPendingRegion(sr);
    setState((s) => ({ ...s, editingRegionId: region.id }));
  };

  // Update pending region from refine sheet
  const handleRefineUpdate = (updated: SelectedRegion) => {
    setPendingRegion(updated);
    // Also sync into selectedRegions
    setState((s) => {
      const exists = s.selectedRegions.some((r) => r.region.id === updated.region.id);
      return {
        ...s,
        selectedRegions: exists
          ? s.selectedRegions.map((r) => r.region.id === updated.region.id ? updated : r)
          : [...s.selectedRegions, updated],
      };
    });
  };

  // Confirm refine → go to questions
  const handleRefineConfirm = () => {
    setState((s) => ({ ...s, step: 'questions' }));
  };

  // Close refine sheet without advancing
  const handleRefineClose = () => {
    setState((s) => ({ ...s, editingRegionId: null }));
    setPendingRegion(null);
  };

  // Update region from questions screen
  const handleQuestionsUpdate = (updated: SelectedRegion) => {
    setState((s) => ({
      ...s,
      selectedRegions: s.selectedRegions.map((r) =>
        r.region.id === updated.region.id ? updated : r
      ),
    }));
  };

  const go = (step: AppStep) => setState((s) => ({ ...s, step }));

  const currentRegion =
    state.editingRegionId
      ? state.selectedRegions.find((r) => r.region.id === state.editingRegionId) ?? null
      : null;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', backgroundColor: '#F8F8FD' }}>
      {/* SCREEN 1: Intro */}
      {state.step === 'intro' && (
        <IntroScreen onStart={() => go('bodymap')} />
      )}

      {/* SCREEN 2: Body Map */}
      {(state.step === 'bodymap' || state.step === 'refine') && (
        <BodyMapScreen
          bodyView={state.bodyView}
          selectedRegions={state.selectedRegions}
          onViewToggle={(v) => setState((s) => ({ ...s, bodyView: v }))}
          onRegionTap={handleRegionTap}
          onRemoveRegion={(id) => setState((s) => ({ ...s, selectedRegions: s.selectedRegions.filter((r) => r.region.id !== id) }))}
          onClearAll={() => setState((s) => ({ ...s, selectedRegions: [] }))}
          onNext={() => {
            if (state.selectedRegions.length > 0) {
              const first = state.selectedRegions[0];
              setState((s) => ({ ...s, editingRegionId: first.region.id, step: 'questions' }));
            }
          }}
          onBack={() => go('intro')}
        />
      )}

      {/* SCREEN 2b: Refine Sheet (slides over body map) */}
      {state.step === 'refine' && currentRegion && (
        <RefineSheet
          region={currentRegion}
          onUpdate={handleRefineUpdate}
          onClose={handleRefineClose}
          onConfirm={handleRefineConfirm}
        />
      )}

      {/* Refine sheet triggered by region tap (on bodymap step) */}
      {state.step === 'bodymap' && state.editingRegionId && currentRegion && (
        <RefineSheet
          region={currentRegion}
          onUpdate={handleRefineUpdate}
          onClose={handleRefineClose}
          onConfirm={() => setState((s) => ({ ...s, step: 'questions' }))}
        />
      )}

      {/* SCREEN 4: Questions */}
      {state.step === 'questions' && currentRegion && (
        <QuestionsScreen
          region={currentRegion}
          onUpdate={handleQuestionsUpdate}
          onBack={() => setState((s) => ({ ...s, step: 'bodymap', editingRegionId: null }))}
          onNext={() => go('review')}
        />
      )}

      {/* SCREEN 5: Review */}
      {state.step === 'review' && (
        <ReviewScreen
          selectedRegions={state.selectedRegions}
          onBack={() => go('bodymap')}
          onAddAnother={() => setState((s) => ({ ...s, step: 'bodymap', editingRegionId: null }))}
          onEditRegion={(id) => {
            setState((s) => ({ ...s, editingRegionId: id, step: 'questions' }));
          }}
          onDeleteRegion={(id) => {
            setState((s) => ({
              ...s,
              selectedRegions: s.selectedRegions.filter((r) => r.region.id !== id),
              step: s.selectedRegions.length <= 1 ? 'bodymap' : 'review',
            }));
          }}
          onSubmit={() => onComplete?.(state.selectedRegions)}
        />
      )}
    </div>
  );
}
