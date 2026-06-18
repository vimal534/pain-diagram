import React from 'react';
import { BodyView, BodyRegion, SelectedRegion } from '../../types/pain';

// Body silhouette images from Figma
const BODY_FRONT_IMAGE = 'https://www.figma.com/api/mcp/asset/ffdc20de-e1a1-4554-83ac-35b3b3ab080e';
const BODY_BACK_IMAGE = 'https://www.figma.com/api/mcp/asset/860d7b83-e618-4395-9e7a-9b99e66d762c';
const CHEVRON_LEFT = 'https://www.figma.com/api/mcp/asset/b8710420-86dd-44df-b57e-d78318c03f58';
const HIGHLIGHT_ZONE = 'https://www.figma.com/api/mcp/asset/b28bc22f-6f5a-43c4-9470-9212a657495b';

const BODY_REGIONS: BodyRegion[] = [
  // Front view regions (positions as % of image container)
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
  // Back view regions
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
  onBack: () => void;
}

const colors = {
  primary: '#2487F5',
  textPrimary: '#101828',
  textSecondary: '#6A7282',
  cardBg: '#FEFEFE',
  cardBorder: '#ECECEC',
  toggleBg: '#F8F9FA',
};

export default function BodyMapScreen({ bodyView, selectedRegions, onViewToggle, onRegionTap, onBack }: Props) {
  const bodyImage = bodyView === 'front' ? BODY_FRONT_IMAGE : BODY_BACK_IMAGE;
  const visibleRegions = BODY_REGIONS.filter((r) => r.view === bodyView);
  const selectedIds = selectedRegions.map((s) => s.region.id);

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        fontFamily: 'Plus Jakarta Sans, sans-serif',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '16px 20px 18px',
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            width: 17,
            height: 22,
            flexShrink: 0,
          }}
        >
          <img src={CHEVRON_LEFT} alt="Back" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </button>
        <h1
          style={{
            margin: 0,
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontWeight: 700,
            fontSize: 22,
            lineHeight: '32px',
            color: colors.textPrimary,
          }}
        >
          Where do you feel pain?
        </h1>
      </div>

      {/* Body map card */}
      <div style={{ padding: '8px 20px 16px', flex: 1, overflow: 'hidden' }}>
        <div
          style={{
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.cardBorder}`,
            borderRadius: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '8px 0 12px',
            height: '100%',
            boxSizing: 'border-box',
            position: 'relative',
          }}
        >
          {/* Instruction text */}
          <p
            style={{
              margin: '0 0 4px',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400,
              fontSize: 14,
              lineHeight: '20px',
              color: colors.textSecondary,
            }}
          >
            Tap an area of the body
          </p>

          {/* Left/Right labels */}
          <div
            style={{
              position: 'absolute',
              top: 44,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0 28px',
            }}
          >
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: colors.textSecondary }}>Left</span>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: colors.textSecondary }}>Right</span>
          </div>

          {/* Body image container with click zones */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              flex: 1,
              minHeight: 0,
            }}
          >
            <img
              src={bodyImage}
              alt="Body silhouette"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                display: 'block',
                pointerEvents: 'none',
              }}
            />
            {/* Clickable regions */}
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
                    background: isSelected ? 'rgba(36, 135, 245, 0.45)' : 'transparent',
                    border: isSelected ? '2px solid #2487F5' : '2px solid transparent',
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
              backgroundColor: colors.toggleBg,
              borderRadius: 16,
              padding: 4,
              display: 'flex',
              gap: 4,
              width: 204,
              boxSizing: 'border-box',
              marginTop: 8,
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
                    padding: '8px 0',
                    borderRadius: 14,
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                    boxShadow: isActive ? '0px 1px 2px rgba(0,0,0,0.1)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span
                    style={{
                      fontFamily: isActive ? 'Plus Jakarta Sans, sans-serif' : 'Inter, sans-serif',
                      fontWeight: 600,
                      fontSize: 14,
                      lineHeight: '20px',
                      color: isActive ? colors.primary : colors.textSecondary,
                      textTransform: 'capitalize',
                    }}
                  >
                    {view.charAt(0).toUpperCase() + view.slice(1)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
