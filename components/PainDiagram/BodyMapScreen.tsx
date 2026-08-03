import React from 'react';
import { BodyView, BodyRegion, SelectedRegion } from '../../types/pain';
import { C } from './tokens';

const BODY_FRONT_IMAGE = 'https://www.figma.com/api/mcp/asset/ffdc20de-e1a1-4554-83ac-35b3b3ab080e';
const BODY_BACK_IMAGE = 'https://www.figma.com/api/mcp/asset/860d7b83-e618-4395-9e7a-9b99e66d762c';

const BODY_REGIONS: BodyRegion[] = [
  { id: 'right-shoulder-front', label: 'Right shoulder', side: 'right', view: 'front', top: 20, left: 52, width: 23, height: 14 },
  { id: 'left-shoulder-front', label: 'Left shoulder', side: 'left', view: 'front', top: 20, left: 25, width: 23, height: 14 },
  { id: 'right-arm-front', label: 'Right arm', side: 'right', view: 'front', top: 32, left: 58, width: 16, height: 20 },
  { id: 'left-arm-front', label: 'Left arm', side: 'left', view: 'front', top: 32, left: 26, width: 16, height: 20 },
  { id: 'chest-front', label: 'Chest', side: 'center', view: 'front', top: 22, left: 35, width: 30, height: 18 },
  { id: 'abdomen-front', label: 'Abdomen', side: 'center', view: 'front', top: 38, left: 35, width: 30, height: 16 },
  { id: 'right-hip-front', label: 'Right hip', side: 'right', view: 'front', top: 52, left: 50, width: 18, height: 14 },
  { id: 'left-hip-front', label: 'Left hip', side: 'left', view: 'front', top: 52, left: 32, width: 18, height: 14 },
  { id: 'right-knee-front', label: 'Right knee', side: 'right', view: 'front', top: 68, left: 52, width: 16, height: 12 },
  { id: 'left-knee-front', label: 'Left knee', side: 'left', view: 'front', top: 68, left: 32, width: 16, height: 12 },
  { id: 'right-ankle-front', label: 'Right ankle', side: 'right', view: 'front', top: 86, left: 52, width: 14, height: 8 },
  { id: 'left-ankle-front', label: 'Left ankle', side: 'left', view: 'front', top: 86, left: 34, width: 14, height: 8 },
  { id: 'upper-back', label: 'Upper back', side: 'center', view: 'back', top: 20, left: 33, width: 34, height: 16 },
  { id: 'lower-back', label: 'Lower back', side: 'center', view: 'back', top: 37, left: 35, width: 30, height: 14 },
  { id: 'right-shoulder-back', label: 'Right shoulder', side: 'right', view: 'back', top: 18, left: 52, width: 22, height: 14 },
  { id: 'left-shoulder-back', label: 'Left shoulder', side: 'left', view: 'back', top: 18, left: 26, width: 22, height: 14 },
  { id: 'right-glute', label: 'Right glute', side: 'right', view: 'back', top: 50, left: 50, width: 18, height: 14 },
  { id: 'left-glute', label: 'Left glute', side: 'left', view: 'back', top: 50, left: 32, width: 18, height: 14 },
];

interface Props {
  bodyView: BodyView;
  selectedRegions: SelectedRegion[];
  onViewToggle: (view: BodyView) => void;
  onRegionTap: (region: BodyRegion) => void;
  onContinue: () => void;
  onBack: () => void;
}

export default function BodyMapScreen({ bodyView, selectedRegions, onViewToggle, onRegionTap, onContinue, onBack }: Props) {
  const bodyImage = bodyView === 'front' ? BODY_FRONT_IMAGE : BODY_BACK_IMAGE;
  const visibleRegions = BODY_REGIONS.filter((r) => r.view === bodyView);
  const selectedIds = selectedRegions.map((s) => s.region.id);
  const hasSelection = selectedRegions.length > 0;

  return (
    <div
      style={{
        backgroundColor: C.bgPage,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        fontFamily: 'Plus Jakarta Sans, sans-serif',
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: C.bgCard,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '20px 20px 16px',
          borderBottom: `1px solid ${C.borderLight}`,
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 8,
            flexShrink: 0,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.textPrimary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0, fontWeight: 700, fontSize: 20, lineHeight: '28px', color: C.textPrimary }}>
            Where does it hurt?
          </h1>
          <p style={{ margin: '2px 0 0', fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 13, color: C.textSecondary }}>
            Tap an area to mark pain
          </p>
        </div>

        {hasSelection && (
          <div
            style={{
              backgroundColor: C.primary,
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: 13,
              lineHeight: 1,
              width: 26,
              height: 26,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {selectedRegions.length}
          </div>
        )}
      </div>

      {/* Body map card */}
      <div style={{ padding: '12px 16px 0', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            backgroundColor: C.bgCard,
            borderRadius: 20,
            boxShadow: `0 2px 16px ${C.primaryBorder}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '10px 0 12px',
            flex: 1,
            overflow: 'hidden',
          }}
        >
          {/* L / R labels */}
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0 24px',
              marginBottom: 2,
            }}
          >
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 600, color: C.textMuted, letterSpacing: '0.8px', textTransform: 'uppercase' }}>L</span>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 600, color: C.textMuted, letterSpacing: '0.8px', textTransform: 'uppercase' }}>R</span>
          </div>

          {/* Body image container with click zones */}
          <div style={{ position: 'relative', width: '100%', flex: 1, minHeight: 0 }}>
            <img
              src={bodyImage}
              alt="Body silhouette"
              style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', pointerEvents: 'none' }}
            />
            {visibleRegions.map((region) => {
              const isSelected = selectedIds.includes(region.id);
              return (
                <button
                  key={region.id}
                  onClick={() => onRegionTap(region)}
                  title={region.label}
                  style={{
                    position: 'absolute',
                    top: `${region.top}%`,
                    left: `${region.left}%`,
                    width: `${region.width}%`,
                    height: `${region.height}%`,
                    background: isSelected ? 'rgba(13, 148, 136, 0.22)' : 'transparent',
                    border: isSelected ? `2px solid ${C.primary}` : '2px solid transparent',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                />
              );
            })}
          </div>

          {/* Front / Back toggle */}
          <div
            style={{
              backgroundColor: C.primaryLight,
              borderRadius: 14,
              padding: 3,
              display: 'flex',
              gap: 2,
              width: 176,
              boxSizing: 'border-box',
              marginTop: 10,
            }}
          >
            {(['front', 'back'] as BodyView[]).map((view) => {
              const isActive = bodyView === view;
              return (
                <button
                  key={view}
                  onClick={() => onViewToggle(view)}
                  style={{
                    flex: 1,
                    padding: '7px 0',
                    borderRadius: 11,
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: isActive ? C.primary : 'transparent',
                    boxShadow: isActive ? '0 1px 4px rgba(13,148,136,0.3)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                      fontWeight: 600,
                      fontSize: 13,
                      color: isActive ? '#FFFFFF' : C.textSecondary,
                    }}
                  >
                    {view === 'front' ? 'Front' : 'Back'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Continue button — shown when at least one region is selected */}
      <div style={{ padding: hasSelection ? '12px 16px 20px' : '0 16px', overflow: 'hidden', maxHeight: hasSelection ? 80 : 0, transition: 'max-height 0.25s ease, padding 0.25s ease' }}>
        <button
          onClick={onContinue}
          style={{
            width: '100%',
            padding: '15px 0',
            borderRadius: 16,
            border: 'none',
            backgroundColor: C.primary,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            boxShadow: '0 4px 12px rgba(13, 148, 136, 0.35)',
          }}
        >
          <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 16, color: '#FFFFFF' }}>
            Continue
          </span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
