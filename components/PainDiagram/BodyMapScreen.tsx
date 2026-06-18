import React from 'react';
import { BodyView, BodyRegion, SelectedRegion } from '../../types/pain';
import { colors, radius, shadow, font } from './tokens';

const BODY_FRONT_IMAGE = 'https://www.figma.com/api/mcp/asset/ffdc20de-e1a1-4554-83ac-35b3b3ab080e';
const BODY_BACK_IMAGE = 'https://www.figma.com/api/mcp/asset/860d7b83-e618-4395-9e7a-9b99e66d762c';
const CHEVRON_LEFT = 'https://www.figma.com/api/mcp/asset/b8710420-86dd-44df-b57e-d78318c03f58';

export const BODY_REGIONS: BodyRegion[] = [
  { id: 'right-shoulder-front', label: 'Right Shoulder', side: 'right', view: 'front', top: 19, left: 52, width: 21, height: 13 },
  { id: 'left-shoulder-front', label: 'Left Shoulder', side: 'left', view: 'front', top: 19, left: 27, width: 21, height: 13 },
  { id: 'right-arm-front', label: 'Right Forearm', side: 'right', view: 'front', top: 36, left: 57, width: 15, height: 18 },
  { id: 'left-arm-front', label: 'Left Forearm', side: 'left', view: 'front', top: 36, left: 28, width: 15, height: 18 },
  { id: 'chest-front', label: 'Chest', side: 'center', view: 'front', top: 22, left: 36, width: 28, height: 16 },
  { id: 'abdomen-front', label: 'Abdomen', side: 'center', view: 'front', top: 38, left: 37, width: 26, height: 14 },
  { id: 'right-hip-front', label: 'Right Hip', side: 'right', view: 'front', top: 51, left: 51, width: 17, height: 13 },
  { id: 'left-hip-front', label: 'Left Hip', side: 'left', view: 'front', top: 51, left: 32, width: 17, height: 13 },
  { id: 'right-thigh-front', label: 'Right Thigh', side: 'right', view: 'front', top: 63, left: 52, width: 15, height: 16 },
  { id: 'left-thigh-front', label: 'Left Thigh', side: 'left', view: 'front', top: 63, left: 33, width: 15, height: 16 },
  { id: 'right-knee-front', label: 'Right Knee', side: 'right', view: 'front', top: 75, left: 52, width: 14, height: 10 },
  { id: 'left-knee-front', label: 'Left Knee', side: 'left', view: 'front', top: 75, left: 34, width: 14, height: 10 },
  { id: 'right-ankle-front', label: 'Right Ankle', side: 'right', view: 'front', top: 88, left: 52, width: 12, height: 7 },
  { id: 'left-ankle-front', label: 'Left Ankle', side: 'left', view: 'front', top: 88, left: 36, width: 12, height: 7 },
  { id: 'neck-front', label: 'Neck', side: 'center', view: 'front', top: 11, left: 40, width: 20, height: 9 },
  { id: 'head-front', label: 'Head', side: 'center', view: 'front', top: 1, left: 38, width: 24, height: 11 },
  // Back
  { id: 'upper-back', label: 'Upper Back', side: 'center', view: 'back', top: 20, left: 34, width: 32, height: 15 },
  { id: 'lower-back', label: 'Lower Back', side: 'center', view: 'back', top: 36, left: 36, width: 28, height: 13 },
  { id: 'right-shoulder-back', label: 'Right Shoulder', side: 'right', view: 'back', top: 17, left: 53, width: 20, height: 13 },
  { id: 'left-shoulder-back', label: 'Left Shoulder', side: 'left', view: 'back', top: 17, left: 27, width: 20, height: 13 },
  { id: 'right-glute', label: 'Right Glute', side: 'right', view: 'back', top: 50, left: 51, width: 17, height: 13 },
  { id: 'left-glute', label: 'Left Glute', side: 'left', view: 'back', top: 50, left: 32, width: 17, height: 13 },
  { id: 'right-hamstring', label: 'Right Hamstring', side: 'right', view: 'back', top: 63, left: 51, width: 15, height: 16 },
  { id: 'left-hamstring', label: 'Left Hamstring', side: 'left', view: 'back', top: 63, left: 34, width: 15, height: 16 },
  { id: 'neck-back', label: 'Neck', side: 'center', view: 'back', top: 11, left: 40, width: 20, height: 9 },
];

interface Props {
  bodyView: BodyView;
  selectedRegions: SelectedRegion[];
  onViewToggle: (v: BodyView) => void;
  onRegionTap: (r: BodyRegion) => void;
  onRemoveRegion: (id: string) => void;
  onClearAll: () => void;
  onNext: () => void;
  onBack: () => void;
}

export default function BodyMapScreen({
  bodyView, selectedRegions, onViewToggle, onRegionTap, onRemoveRegion, onClearAll, onNext, onBack,
}: Props) {
  const bodyImage = bodyView === 'front' ? BODY_FRONT_IMAGE : BODY_BACK_IMAGE;
  const visibleRegions = BODY_REGIONS.filter((r) => r.view === bodyView);
  const selectedIds = selectedRegions.map((s) => s.region.id);
  const selectedCount = selectedRegions.length;

  return (
    <div style={{ backgroundColor: colors.bg, display: 'flex', flexDirection: 'column', height: '100%', fontFamily: font.heading }}>
      <StatusBar />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 20px 16px' }}>
        <button onClick={onBack} style={iconBtnStyle}>
          <img src={CHEVRON_LEFT} alt="Back" style={{ width: 10, height: 18, objectFit: 'contain' }} />
        </button>
        <div>
          <h1 style={{ margin: 0, fontWeight: 800, fontSize: 22, color: colors.text, letterSpacing: '-0.3px' }}>
            Where do you feel pain?
          </h1>
          <p style={{ margin: '2px 0 0', fontFamily: font.body, fontSize: 13, color: colors.textSecondary }}>
            Tap the body to select areas
          </p>
        </div>
      </div>

      {/* Body card */}
      <div style={{ flex: 1, padding: '0 20px', minHeight: 0 }}>
        <div style={{
          backgroundColor: colors.cardBg,
          borderRadius: radius.card,
          boxShadow: shadow.card,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '12px 0 12px',
          height: '100%',
          boxSizing: 'border-box',
          position: 'relative',
        }}>
          {/* Front/Back toggle inside card */}
          <div style={{
            display: 'flex',
            backgroundColor: colors.bg,
            borderRadius: 14,
            padding: 3,
            gap: 2,
            marginBottom: 8,
          }}>
            {(['front', 'back'] as BodyView[]).map((v) => {
              const active = bodyView === v;
              return (
                <button key={v} onClick={() => onViewToggle(v)} style={{
                  padding: '6px 24px',
                  borderRadius: 12,
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: active ? '#FFFFFF' : 'transparent',
                  boxShadow: active ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.2s',
                }}>
                  <span style={{
                    fontFamily: font.heading,
                    fontWeight: 600,
                    fontSize: 13,
                    color: active ? colors.primary : colors.textSecondary,
                  }}>
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Left/Right labels */}
          <div style={{ position: 'absolute', top: 52, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', padding: '0 24px' }}>
            <span style={{ fontFamily: font.body, fontSize: 11, color: colors.textMuted, fontWeight: 500 }}>Left</span>
            <span style={{ fontFamily: font.body, fontSize: 11, color: colors.textMuted, fontWeight: 500 }}>Right</span>
          </div>

          {/* Body diagram */}
          <div style={{ position: 'relative', flex: 1, width: '100%', minHeight: 0 }}>
            <img src={bodyImage} alt="Body" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', pointerEvents: 'none' }} />
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
                    background: isSelected ? 'rgba(36,135,245,0.35)' : 'transparent',
                    border: isSelected ? '2px solid #2487F5' : '2px solid transparent',
                    borderRadius: '40%',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    outline: 'none',
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected tags */}
      {selectedCount > 0 && (
        <div style={{ padding: '12px 20px 0' }}>
          <div style={{ backgroundColor: colors.cardBg, borderRadius: radius.card, padding: '14px 16px', boxShadow: shadow.card }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontFamily: font.heading, fontWeight: 700, fontSize: 13, color: colors.text }}>
                Selected ({selectedCount})
              </span>
              <button onClick={onClearAll} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: font.body, fontSize: 12, color: colors.textMuted, fontWeight: 500 }}>
                Clear all
              </button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {selectedRegions.map((sr) => (
                <div key={sr.region.id} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  backgroundColor: colors.orangeBg, borderRadius: 9999, padding: '4px 10px',
                }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: colors.orange, display: 'inline-block', flexShrink: 0 }} />
                  <span style={{ fontFamily: font.body, fontSize: 12, fontWeight: 500, color: '#1E2939' }}>{sr.region.label}</span>
                  <button onClick={() => onRemoveRegion(sr.region.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', fontSize: 14, lineHeight: 1, padding: 0, display: 'flex' }}>×</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Next button */}
      <div style={{ padding: '12px 20px 28px' }}>
        <button
          onClick={onNext}
          disabled={selectedCount === 0}
          style={{
            width: '100%', padding: '17px 0', borderRadius: radius.button, border: 'none',
            backgroundColor: selectedCount > 0 ? colors.primary : '#D1D5DB',
            cursor: selectedCount > 0 ? 'pointer' : 'not-allowed',
            boxShadow: selectedCount > 0 ? shadow.button : 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'all 0.2s',
          }}
        >
          <span style={{ fontFamily: font.heading, fontWeight: 700, fontSize: 16, color: '#FFFFFF' }}>
            {selectedCount === 0 ? 'Select a pain area' : `Next  →`}
          </span>
        </button>
      </div>
    </div>
  );
}

const iconBtnStyle: React.CSSProperties = {
  width: 36, height: 36, borderRadius: 12, backgroundColor: '#FFFFFF',
  border: `1px solid ${colors.border}`, display: 'flex', alignItems: 'center',
  justifyContent: 'center', cursor: 'pointer', flexShrink: 0,
  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
};

function StatusBar() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px 4px', flexShrink: 0 }}>
      <span style={{ fontFamily: font.body, fontWeight: 600, fontSize: 15, color: colors.text }}>9:41</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: colors.text }}>
        <span>▐▐▐</span><span>WiFi</span><span>🔋</span>
      </div>
    </div>
  );
}
