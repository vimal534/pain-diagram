import React, { useEffect, useState } from 'react';
import { SelectedRegion, PainLevel, PainDescriptor } from '../../types/pain';

const ARROW_ICON = 'https://www.figma.com/api/mcp/asset/cc501a14-73d9-491e-bf13-2a8ed025144e';
const CLOSE_ICON = 'https://www.figma.com/api/mcp/asset/3dbedf06-39c7-4023-abf8-f83d21999748';

const EXACT_SPOTS = ['Front shoulder', 'Back shoulder', 'Deep inside shoulder'];
const PAIN_DESCRIPTORS: PainDescriptor[] = ['Sharp', 'Burning', 'Stiffness', 'Throbbing', 'Tingling', 'Numbness'];

interface PainLevelOption {
  value: PainLevel;
  label: string;
  dotColor: string;
  selectedBg: string;
  selectedBorder: string;
  selectedText: string;
}

const PAIN_LEVELS: PainLevelOption[] = [
  {
    value: 'mild',
    label: 'Mild',
    dotColor: '#EAB308',
    selectedBg: '#FFFFFF',
    selectedBorder: '#E5E7EB',
    selectedText: '#4A5565',
  },
  {
    value: 'moderate',
    label: 'Moderate',
    dotColor: '#F97316',
    selectedBg: '#FFF7ED',
    selectedBorder: '#F97316',
    selectedText: '#1E2939',
  },
  {
    value: 'severe',
    label: 'Severe',
    dotColor: '#EF4444',
    selectedBg: '#FFFFFF',
    selectedBorder: '#E5E7EB',
    selectedText: '#4A5565',
  },
];

interface Props {
  region: SelectedRegion;
  onUpdate: (updated: SelectedRegion) => void;
  onRemove: () => void;
  onNext: () => void;
  onClose: () => void;
}

const colors = {
  primary: '#2487F5',
  selectedBg: 'rgba(36, 135, 245, 0.08)',
  borderDefault: '#E5E7EB',
  textPrimary: '#101828',
  textSecondary: '#6A7282',
  textMuted: '#99A1AF',
  labelColor: '#6A7282',
};

const sectionLabelStyle: React.CSSProperties = {
  fontFamily: 'Plus Jakarta Sans, sans-serif',
  fontWeight: 700,
  fontSize: 11,
  lineHeight: '16.5px',
  letterSpacing: '0.55px',
  textTransform: 'uppercase',
  color: colors.textMuted,
  marginBottom: 0,
};

export default function PainDetailSheet({ region, onUpdate, onRemove, onNext, onClose }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger slide-up animation
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const toggleExactSpot = (spot: string) => {
    onUpdate({ ...region, exactSpot: region.exactSpot === spot ? null : spot });
  };

  const togglePainLevel = (level: PainLevel) => {
    onUpdate({ ...region, painLevel: region.painLevel === level ? null : level });
  };

  const toggleDescriptor = (desc: PainDescriptor) => {
    const has = region.descriptors.includes(desc);
    onUpdate({
      ...region,
      descriptors: has ? region.descriptors.filter((d) => d !== desc) : [...region.descriptors, desc],
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.2)',
          zIndex: 10,
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Sheet */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#FFFFFF',
          borderRadius: '20px 20px 0 0',
          boxShadow: '0px -8px 25px rgba(0,0,0,0.15)',
          zIndex: 20,
          transform: visible ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '82%',
        }}
      >
        {/* Handle bar */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12, paddingBottom: 4 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: '#E5E7EB' }} />
        </div>

        {/* Sheet header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            padding: '12px 20px 0',
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontWeight: 700,
                fontSize: 16,
                lineHeight: '24px',
                color: colors.textPrimary,
              }}
            >
              {region.region.label}
            </p>
            <p
              style={{
                margin: '4px 0 0',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontWeight: 400,
                fontSize: 12,
                lineHeight: '16px',
                color: colors.textMuted,
              }}
            >
              Refine the spot & how it feels
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: '#F3F4F6',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <img src={CLOSE_ICON} alt="Close" style={{ width: 15, height: 15 }} />
          </button>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }}>
          {/* EXACT SPOT */}
          <div style={{ marginTop: 20 }}>
            <p style={sectionLabelStyle}>Exact Spot</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingTop: 10 }}>
              {EXACT_SPOTS.map((spot) => {
                const isSelected = region.exactSpot === spot;
                return (
                  <button
                    key={spot}
                    onClick={() => toggleExactSpot(spot)}
                    style={{
                      padding: '11px 11px',
                      borderRadius: 16,
                      border: `1.5px solid ${isSelected ? colors.primary : colors.borderDefault}`,
                      backgroundColor: isSelected ? colors.selectedBg : '#FFFFFF',
                      cursor: 'pointer',
                      outline: 'none',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'Plus Jakarta Sans, sans-serif',
                        fontWeight: 600,
                        fontSize: 14,
                        lineHeight: '20px',
                        color: isSelected ? colors.primary : '#4A5565',
                      }}
                    >
                      {isSelected ? `✓ ${spot}` : spot}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* PAIN LEVEL */}
          <div style={{ marginTop: 20 }}>
            <p style={sectionLabelStyle}>Pain Level</p>
            <div style={{ display: 'flex', gap: 8, paddingTop: 10 }}>
              {PAIN_LEVELS.map(({ value, label, dotColor, selectedBg, selectedBorder, selectedText }) => {
                const isSelected = region.painLevel === value;
                return (
                  <button
                    key={value}
                    onClick={() => togglePainLevel(value)}
                    style={{
                      flex: 1,
                      padding: '11px 1px',
                      borderRadius: 16,
                      border: `1.5px solid ${isSelected ? selectedBorder : colors.borderDefault}`,
                      backgroundColor: isSelected ? selectedBg : '#FFFFFF',
                      cursor: 'pointer',
                      outline: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                    }}
                  >
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        backgroundColor: dotColor,
                        flexShrink: 0,
                        display: 'inline-block',
                      }}
                    />
                    <span
                      style={{
                        fontFamily: 'Plus Jakarta Sans, sans-serif',
                        fontWeight: 600,
                        fontSize: 14,
                        lineHeight: '20px',
                        color: isSelected ? selectedText : '#4A5565',
                      }}
                    >
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* DESCRIBE YOUR PAIN */}
          <div style={{ marginTop: 20, marginBottom: 24 }}>
            <p
              style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontWeight: 600,
                fontSize: 12,
                lineHeight: '16px',
                letterSpacing: '0.3px',
                textTransform: 'uppercase',
                color: colors.labelColor,
                margin: 0,
              }}
            >
              Describe Your Pain
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingTop: 8 }}>
              {PAIN_DESCRIPTORS.map((desc) => {
                const isSelected = region.descriptors.includes(desc);
                return (
                  <button
                    key={desc}
                    onClick={() => toggleDescriptor(desc)}
                    style={{
                      padding: '9px 15px',
                      borderRadius: 16,
                      border: `1.5px solid ${isSelected ? colors.primary : colors.borderDefault}`,
                      backgroundColor: isSelected ? colors.selectedBg : '#FFFFFF',
                      cursor: 'pointer',
                      outline: 'none',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'Plus Jakarta Sans, sans-serif',
                        fontWeight: 500,
                        fontSize: 14,
                        lineHeight: '20px',
                        color: isSelected ? colors.primary : colors.textPrimary,
                      }}
                    >
                      {isSelected ? `✓ ${desc}` : desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '24px 20px 20px',
            display: 'flex',
            gap: 12,
            borderTop: '1px solid #F3F4F6',
          }}
        >
          <button
            onClick={onRemove}
            style={{
              flex: '0 0 115px',
              padding: '15px 1px',
              borderRadius: 16,
              border: '1.5px solid #FFC9C9',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <span
              style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontWeight: 600,
                fontSize: 14,
                lineHeight: '20px',
                color: '#FB2C36',
              }}
            >
              Remove
            </span>
          </button>
          <button
            onClick={onNext}
            style={{
              flex: 1,
              padding: '14px 0',
              borderRadius: 16,
              border: 'none',
              backgroundColor: colors.primary,
              cursor: 'pointer',
              outline: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
            }}
          >
            <span
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: 16,
                lineHeight: '24px',
                color: '#FFFFFF',
              }}
            >
              Next
            </span>
            <img src={ARROW_ICON} alt="→" style={{ width: 18, height: 18 }} />
          </button>
        </div>
      </div>
    </>
  );
}
