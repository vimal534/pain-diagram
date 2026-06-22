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
  editSource: null,
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
        editSource: 'bodymap',
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

  // After PainDetailSheet "Next →": always go to QuestionsScreen, keep editingRegionId for pre-population
  const handleSheetSave = () => {
    setState(s => ({ ...s, step: 'questions' }));
  };

  const handleSheetRemove = () => {
    const id = state.editingRegionId;
    setState(s => {
      const remaining = s.selectedRegions.filter(r => r.region.id !== id);
      return {
        ...s,
        editingRegionId: null,
        editSource: null,
        selectedRegions: remaining,
        successToast: null,
        // If editing from review and regions remain, go back to review
        step: s.editSource === 'review'
          ? (remaining.length === 0 ? 'bodymap' : 'review')
          : s.step,
      };
    });
  };

  const handleSheetClose = () => {
    const id = state.editingRegionId;
    setState(s => {
      const region = s.selectedRegions.find(r => r.region.id === id);
      const wasSaved = region?.painLevel !== null;
      return {
        ...s,
        editingRegionId: null,
        editSource: null,
        // If from review, stay on review. If from bodymap, remove unsaved region.
        selectedRegions: (s.editSource === 'review' || wasSaved)
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

  const handleQuestionsBack = () => {
    // If we came from review edit flow, go back to review; otherwise bodymap
    if (state.editSource === 'review') {
      setState(s => ({ ...s, step: 'review', editingRegionId: null, editSource: null }));
    } else {
      go('bodymap');
    }
  };

  const handleQuestionsNext = () => {
    setState(s => ({ ...s, step: 'review', editingRegionId: null, editSource: null }));
  };

  const handleDeleteRegion = (id: string) => {
    setState(s => {
      const remaining = s.selectedRegions.filter(r => r.region.id !== id);
      return { ...s, selectedRegions: remaining, step: remaining.length === 0 ? 'bodymap' : 'review' };
    });
  };

  // Show PainDetailSheet over bodymap OR over review (edit flow)
  const showSheet = state.editingRegionId && editingRegion &&
    (state.step === 'bodymap' || (state.step === 'review' && state.editSource === 'review'));

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

      {state.step === 'review' && (
        <ReviewScreen
          selectedRegions={state.selectedRegions}
          onBack={() => go('questions')}
          onEditRegion={id => setState(s => ({ ...s, editingRegionId: id, editSource: 'review' }))}
          onDeleteRegion={handleDeleteRegion}
          onAddAnother={() => go('bodymap')}
          onSubmit={() => go('thankyou')}
        />
      )}

      {showSheet && (
        <PainDetailSheet
          region={editingRegion!}
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
          onBack={handleQuestionsBack}
          onNext={handleQuestionsNext}
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
