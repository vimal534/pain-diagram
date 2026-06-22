import React, { useState } from 'react';
import { AppState, AppStep, BodyRegion, SelectedRegion, makeEmptyRegion } from '../../types/pain';
import IntroScreen from './IntroScreen';
import BodyMapScreen from './BodyMapScreen';
import PainDetailSheet from './PainDetailSheet';
import QuestionsScreen from './QuestionsScreen';
import ReviewScreen from './ReviewScreen';
import ThankYouScreen from './ThankYouScreen';

const initial: AppState = {
  step: 'intro',
  selectedRegions: [],
  editingRegionId: null,
  successToast: null,
};

interface Props {
  onComplete?: (regions: SelectedRegion[]) => void;
}

export default function PainDiagram({ onComplete }: Props) {
  const [state, setState] = useState<AppState>(initial);

  const go = (step: AppStep) => setState(s => ({ ...s, step }));

  const editingRegion = state.editingRegionId
    ? state.selectedRegions.find(r => r.region.id === state.editingRegionId) ?? null
    : null;

  const handleRegionTap = (region: BodyRegion) => {
    const existing = state.selectedRegions.find(r => r.region.id === region.id);
    const sr = existing ?? makeEmptyRegion(region);
    setState(s => {
      const alreadyIn = s.selectedRegions.some(r => r.region.id === region.id);
      return {
        ...s,
        editingRegionId: region.id,
        selectedRegions: alreadyIn ? s.selectedRegions : [...s.selectedRegions, sr],
      };
    });
  };

  const handleSheetUpdate = (updated: SelectedRegion) => {
    setState(s => ({
      ...s,
      selectedRegions: s.selectedRegions.map(r => r.region.id === updated.region.id ? updated : r),
    }));
  };

  const handleSheetSave = () => {
    setState(s => ({ ...s, editingRegionId: null, step: 'questions' }));
  };

  const handleSheetRemove = () => {
    const id = state.editingRegionId;
    setState(s => ({
      ...s,
      editingRegionId: null,
      selectedRegions: s.selectedRegions.filter(r => r.region.id !== id),
      successToast: null,
    }));
  };

  const handleSheetClose = () => {
    const id = state.editingRegionId;
    setState(s => {
      const region = s.selectedRegions.find(r => r.region.id === id);
      const wasSaved = region?.painLevel !== null;
      return {
        ...s,
        editingRegionId: null,
        selectedRegions: wasSaved
          ? s.selectedRegions
          : s.selectedRegions.filter(r => r.region.id !== id),
      };
    });
  };

  const handleQuestionsUpdate = (updated: SelectedRegion) => {
    setState(s => ({
      ...s,
      selectedRegions: s.selectedRegions.map(r => r.region.id === updated.region.id ? updated : r),
    }));
  };

  const handleDeleteRegion = (id: string) => {
    setState(s => {
      const remaining = s.selectedRegions.filter(r => r.region.id !== id);
      return { ...s, selectedRegions: remaining, step: remaining.length === 0 ? 'bodymap' : 'review' };
    });
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', backgroundColor: '#FFFFFF' }}>
      {state.step === 'intro' && (
        <IntroScreen onStart={() => go('bodymap')} />
      )}

      {state.step === 'bodymap' && (
        <BodyMapScreen
          selectedRegions={state.selectedRegions}
          successToast={state.successToast}
          onRegionTap={handleRegionTap}
          onRemoveRegion={id => setState(s => ({ ...s, selectedRegions: s.selectedRegions.filter(r => r.region.id !== id) }))}
          onClearAll={() => setState(s => ({ ...s, selectedRegions: [] }))}
          onContinue={() => go('questions')}
          onBack={() => go('intro')}
        />
      )}

      {state.step === 'bodymap' && state.editingRegionId && editingRegion && (
        <PainDetailSheet
          region={editingRegion}
          onUpdate={handleSheetUpdate}
          onRemove={handleSheetRemove}
          onSave={handleSheetSave}
          onClose={handleSheetClose}
        />
      )}

      {state.step === 'questions' && (
        <QuestionsScreen
          regions={state.selectedRegions}
          editingRegionId={state.editingRegionId}
          onUpdate={handleQuestionsUpdate}
          onBack={() => go('bodymap')}
          onNext={() => go('review')}
        />
      )}

      {state.step === 'review' && (
        <ReviewScreen
          selectedRegions={state.selectedRegions}
          onBack={() => go('questions')}
          onEditRegion={id => setState(s => ({ ...s, editingRegionId: id, step: 'questions' }))}
          onDeleteRegion={handleDeleteRegion}
          onAddAnother={() => go('bodymap')}
          onSubmit={() => go('thankyou')}
        />
      )}

      {state.step === 'thankyou' && (
        <ThankYouScreen
          selectedRegions={state.selectedRegions}
          onDone={() => {
            onComplete?.(state.selectedRegions);
            setState(initial);
          }}
        />
      )}
    </div>
  );
}
