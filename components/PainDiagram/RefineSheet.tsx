import React, { useEffect, useState } from 'react';
import { SelectedRegion, ExactSpot, PainLevel } from '../../types/pain';
import { colors, radius, shadow, font } from './tokens';

const EXACT_SPOTS: ExactSpot[] = ['Front', 'Inner', 'Outer', 'Back'];

const PAIN_LEVELS: { value: PainLevel; label: string; dot: string; activeBg: string; activeBorder: string }[] = [
  { value: 'mild', label: 'Mild', dot: '#EAB308', activeBg: '#FFFBEB', activeBorder: '#EAB308' },
  { value: 'moderate', label: 'Moderate', dot: '#F97316', activeBg: '#FFF7ED', activeBorder: '#F97316' },
  { value: 'severe', label: 'Severe', dot: '#EF4444', activeBg: '#FEF2F2', activeBorder: '#EF4444' },
];

interface Props {
  region: SelectedRegion;
  onUpdate: (r: SelectedRegion) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export default function RefineSheet({ region, onUpdate, onClose, onConfirm }: Props) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 10); return () => clearTimeout(t); }, []);

  const setSpot = (s: ExactSpot) => onUpdate({ ...region, exactSpot: region.exactSpot === s ? null : s });
  const setLevel = (l: PainLevel) => onUpdate({ ...region, painLevel: region.painLevel === l ? null : l });

  return (
    <>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 10, opacity: visible ? 1 : 0, transition: 'opacity 0.3s' }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20,
        backgroundColor: '#FFFFFF', borderRadius: `${radius.sheet}px ${radius.sheet}px 0 0`,
        boxShadow: shadow.sheet,
        transform: visible ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.35s cubic-bezier(0.32,0.72,0,1)',
        paddingBottom: 32,
      }}>
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12, paddingBottom: 4 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: colors.border }} />
        </div>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '12px 20px 0' }}>
          <div>
            <p style={{ margin: 0, fontFamily: font.heading, fontWeight: 800, fontSize: 18, color: colors.text }}>
              {region.region.label}
            </p>
            <p style={{ margin: '3px 0 0', fontFamily: font.body, fontSize: 13, color: colors.textSecondary }}>
              Refine the location and severity
            </p>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: colors.bg, border: 'none', cursor: 'pointer', fontSize: 18, color: colors.textSecondary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            ×
          </button>
        </div>

        <div style={{ padding: '20px 20px 0' }}>
          {/* Exact spot */}
          <SectionLabel>Location</SectionLabel>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingTop: 10 }}>
            {EXACT_SPOTS.map((spot) => {
              const active = region.exactSpot === spot;
              return (
                <button key={spot} onClick={() => setSpot(spot)} style={{
                  padding: '10px 18px', borderRadius: radius.chip,
                  border: `1.5px solid ${active ? colors.primary : colors.border}`,
                  backgroundColor: active ? colors.selectedBg : '#FFFFFF',
                  cursor: 'pointer', outline: 'none',
                }}>
                  <span style={{ fontFamily: font.heading, fontWeight: 600, fontSize: 14, color: active ? colors.primary : '#4A5565' }}>
                    {active ? `✓ ${spot}` : spot}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Pain level */}
          <div style={{ marginTop: 20 }}>
            <SectionLabel>Pain Level</SectionLabel>
            <div style={{ display: 'flex', gap: 8, paddingTop: 10 }}>
              {PAIN_LEVELS.map(({ value, label, dot, activeBg, activeBorder }) => {
                const active = region.painLevel === value;
                return (
                  <button key={value} onClick={() => setLevel(value)} style={{
                    flex: 1, padding: '12px 4px', borderRadius: radius.chip,
                    border: `1.5px solid ${active ? activeBorder : colors.border}`,
                    backgroundColor: active ? activeBg : '#FFFFFF',
                    cursor: 'pointer', outline: 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  }}>
                    <span style={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: dot, display: 'inline-block', flexShrink: 0 }} />
                    <span style={{ fontFamily: font.heading, fontWeight: 600, fontSize: 14, color: active ? colors.text : '#4A5565' }}>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Confirm */}
          <button onClick={onConfirm} style={{
            width: '100%', marginTop: 24, padding: '17px 0', borderRadius: radius.button,
            border: 'none', backgroundColor: colors.primary, cursor: 'pointer',
            boxShadow: shadow.button, fontFamily: font.heading, fontWeight: 700, fontSize: 16, color: '#FFFFFF',
          }}>
            Next  →
          </button>
        </div>
      </div>
    </>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ margin: 0, fontFamily: font.body, fontWeight: 600, fontSize: 11, letterSpacing: '0.6px', textTransform: 'uppercase', color: colors.textMuted }}>
      {children}
    </p>
  );
}
