import React, { useEffect, useState } from 'react';
import { SelectedRegion, PainLevel, PainDescriptor } from '../../types/pain';
import { C } from './tokens';

const EXACT_SPOTS = ['Front shoulder', 'Back shoulder', 'Deep inside shoulder'];
const PAIN_DESCRIPTORS: PainDescriptor[] = ['Sharp', 'Burning', 'Stiffness', 'Throbbing', 'Tingling', 'Numbness'];

interface PainLevelOption {
  value: PainLevel;
  label: string;
  dot: string;
  selectedBg: string;
  selectedBorder: string;
  selectedText: string;
}

const PAIN_LEVELS: PainLevelOption[] = [
  {
    value: 'mild',
    label: 'Mild',
    dot: C.painMild,
    selectedBg: C.painMildBg,
    selectedBorder: C.painMild,
    selectedText: '#92400E',
  },
  {
    value: 'moderate',
    label: 'Moderate',
    dot: C.painModerate,
    selectedBg: C.painModerateBg,
    selectedBorder: C.painModerate,
    selectedText: '#9A3412',
  },
  {
    value: 'severe',
    label: 'Severe',
    dot: C.painSevere,
    selectedBg: C.painSevereBg,
    selectedBorder: C.painSevere,
    selectedText: '#991B1B',
  },
];

interface Props {
  region: SelectedRegion;
  onUpdate: (updated: SelectedRegion) => void;
  onRemove: () => void;
  onNext: () => void;
  onClose: () => void;
}

const labelStyle: React.CSSProperties = {
  fontFamily: 'Inter, sans-serif',
  fontWeight: 600,
  fontSize: 11,
  lineHeight: '16px',
  letterSpacing: '0.7px',
  textTransform: 'uppercase',
  color: C.textMuted,
  margin: 0,
};

export default function PainDetailSheet({ region, onUpdate, onRemove, onNext, onClose }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
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
          backgroundColor: 'rgba(0,0,0,0.25)',
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
          borderRadius: '24px 24px 0 0',
          boxShadow: '0px -4px 32px rgba(0,0,0,0.12)',
          zIndex: 20,
          transform: visible ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '84%',
        }}
      >
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 14, paddingBottom: 4 }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: C.border }} />
        </div>

        {/* Sheet header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '10px 20px 0' }}>
          <div>
            <p style={{ margin: 0, fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 18, lineHeight: '26px', color: C.textPrimary }}>
              {region.region.label}
            </p>
            <p style={{ margin: '3px 0 0', fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 13, color: C.textMuted }}>
              Refine the spot &amp; how it feels
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: C.borderLight,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.textSecondary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }}>

          {/* EXACT SPOT */}
          <div style={{ marginTop: 20 }}>
            <p style={labelStyle}>Exact Spot</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingTop: 10 }}>
              {EXACT_SPOTS.map((spot) => {
                const isSelected = region.exactSpot === spot;
                return (
                  <button
                    key={spot}
                    onClick={() => toggleExactSpot(spot)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 12,
                      border: `1.5px solid ${isSelected ? C.primary : C.border}`,
                      backgroundColor: isSelected ? C.primaryLight : '#FFFFFF',
                      cursor: 'pointer',
                      outline: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      transition: 'all 0.12s ease',
                    }}
                  >
                    {isSelected && (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.primary} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    )}
                    <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, fontSize: 14, color: isSelected ? C.primary : C.textPrimary }}>
                      {spot}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* PAIN LEVEL */}
          <div style={{ marginTop: 22 }}>
            <p style={labelStyle}>Pain Level</p>
            <div style={{ display: 'flex', gap: 8, paddingTop: 10 }}>
              {PAIN_LEVELS.map(({ value, label, dot, selectedBg, selectedBorder, selectedText }) => {
                const isSelected = region.painLevel === value;
                return (
                  <button
                    key={value}
                    onClick={() => togglePainLevel(value)}
                    style={{
                      flex: 1,
                      padding: '11px 4px',
                      borderRadius: 12,
                      border: `1.5px solid ${isSelected ? selectedBorder : C.border}`,
                      backgroundColor: isSelected ? selectedBg : '#FFFFFF',
                      cursor: 'pointer',
                      outline: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      transition: 'all 0.12s ease',
                    }}
                  >
                    <span style={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: dot, flexShrink: 0, display: 'inline-block' }} />
                    <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, fontSize: 13, color: isSelected ? selectedText : C.textSecondary }}>
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* DESCRIPTORS */}
          <div style={{ marginTop: 22, marginBottom: 24 }}>
            <p style={labelStyle}>Describe your pain</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingTop: 10 }}>
              {PAIN_DESCRIPTORS.map((desc) => {
                const isSelected = region.descriptors.includes(desc);
                return (
                  <button
                    key={desc}
                    onClick={() => toggleDescriptor(desc)}
                    style={{
                      padding: '9px 15px',
                      borderRadius: 12,
                      border: `1.5px solid ${isSelected ? C.primary : C.border}`,
                      backgroundColor: isSelected ? C.primaryLight : '#FFFFFF',
                      cursor: 'pointer',
                      outline: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      transition: 'all 0.12s ease',
                    }}
                  >
                    {isSelected && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.primary} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    )}
                    <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 500, fontSize: 14, color: isSelected ? C.primary : C.textPrimary }}>
                      {desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 20px 24px', display: 'flex', gap: 10, borderTop: `1px solid ${C.borderLight}` }}>
          <button
            onClick={onRemove}
            style={{
              flex: '0 0 110px',
              padding: '14px 4px',
              borderRadius: 14,
              border: `1.5px solid ${C.dangerBorder}`,
              backgroundColor: C.dangerBg,
              cursor: 'pointer',
              outline: 'none',
              transition: 'opacity 0.12s ease',
            }}
          >
            <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, fontSize: 14, color: C.danger }}>
              Remove
            </span>
          </button>
          <button
            onClick={onNext}
            style={{
              flex: 1,
              padding: '14px 0',
              borderRadius: 14,
              border: 'none',
              backgroundColor: C.primary,
              cursor: 'pointer',
              outline: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              boxShadow: '0 3px 10px rgba(13, 148, 136, 0.35)',
            }}
          >
            <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 16, color: '#FFFFFF' }}>
              Next
            </span>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
