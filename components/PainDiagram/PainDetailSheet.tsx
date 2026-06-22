import React, { useEffect, useState } from 'react';
import { SelectedRegion, ExactSpot, PainLevel, PainDescriptor } from '../../types/pain';
import { colors, radius, font, SEVERITY_COLORS } from './tokens';

const EXACT_SPOTS: ExactSpot[] = ['Front', 'Inner', 'Outer', 'Back', 'Deep inside'];
const DESCRIPTORS: PainDescriptor[] = ['Sharp', 'Burning', 'Stiffness', 'Throbbing', 'Tingling', 'Numbness'];

interface Props {
  region: SelectedRegion;
  onUpdate: (r: SelectedRegion) => void;
  onRemove: () => void;
  onSave: () => void;
  onClose: () => void;
}

export default function PainDetailSheet({ region, onUpdate, onRemove, onSave, onClose }: Props) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 12); return () => clearTimeout(t); }, []);

  const setSpot = (s: ExactSpot) => onUpdate({ ...region, exactSpot: region.exactSpot === s ? null : s });
  const setLevel = (l: PainLevel) => onUpdate({ ...region, painLevel: region.painLevel === l ? null : l });
  const toggleDesc = (d: PainDescriptor) => {
    const has = region.descriptors.includes(d);
    onUpdate({ ...region, descriptors: has ? region.descriptors.filter(x => x !== d) : [...region.descriptors, d] });
  };

  const canSave = region.painLevel !== null;

  return (
    <>
      {/* Scrim */}
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, zIndex: 30,
        backgroundColor: 'rgba(0,0,0,0.4)',
        opacity: visible ? 1 : 0, transition: 'opacity 0.28s ease',
      }} />

      {/* Sheet */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 40,
        backgroundColor: '#FFFFFF',
        borderRadius: '24px 24px 0 0',
        boxShadow: '0 -4px 32px rgba(0,0,0,0.12)',
        transform: visible ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.36s cubic-bezier(0.32,0.72,0,1)',
        display: 'flex', flexDirection: 'column', maxHeight: '92%',
      }}>
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 0' }}>
          <div style={{ width: 32, height: 3.5, borderRadius: 999, backgroundColor: '#E5E7EB' }} />
        </div>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px 12px' }}>
          <div>
            <p style={{ margin: 0, fontFamily: font.heading, fontWeight: 800, fontSize: 20, color: colors.text, letterSpacing: '-0.3px' }}>
              {region.region.label}
            </p>
            <p style={{ margin: '3px 0 0', fontFamily: font.body, fontSize: 13, color: colors.textSecondary }}>
              Tell us more about this pain area
            </p>
          </div>
          <button onClick={onClose} style={{
            width: 30, height: 30, borderRadius: '50%', backgroundColor: '#F3F4F6',
            border: 'none', cursor: 'pointer', fontSize: 16, color: '#6B7280',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>×</button>
        </div>

        <div style={{ height: 1, backgroundColor: '#F3F4F6' }} />

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 0' }}>

          {/* EXACT SPOT */}
          <Section label="Where exactly?" />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
            {EXACT_SPOTS.map(spot => {
              const active = region.exactSpot === spot;
              return (
                <button key={spot} onClick={() => setSpot(spot)} style={{
                  padding: '9px 18px', borderRadius: 999, outline: 'none', cursor: 'pointer',
                  border: `1.5px solid ${active ? colors.primary : '#E5E7EB'}`,
                  backgroundColor: active ? 'rgba(36,135,245,0.06)' : '#FFFFFF',
                  transition: 'all 0.15s',
                }}>
                  <span style={{ fontFamily: font.body, fontWeight: active ? 600 : 400, fontSize: 14, color: active ? colors.primary : colors.text }}>
                    {active ? `✓ ${spot}` : spot}
                  </span>
                </button>
              );
            })}
          </div>

          {/* PAIN SEVERITY */}
          <div style={{ marginTop: 24 }}>
            <Section label="Pain level" required />
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              {(['mild', 'moderate', 'severe'] as PainLevel[]).map(level => {
                const s = SEVERITY_COLORS[level];
                const active = region.painLevel === level;
                return (
                  <button key={level} onClick={() => setLevel(level)} style={{
                    flex: 1, padding: '11px 8px', borderRadius: 999, outline: 'none', cursor: 'pointer',
                    border: `1.5px solid ${active ? s.border : '#E5E7EB'}`,
                    backgroundColor: active ? s.bg : '#FFFFFF',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                    transition: 'all 0.15s',
                  }}>
                    <span style={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: s.dot, display: 'inline-block', flexShrink: 0 }} />
                    <span style={{ fontFamily: font.body, fontWeight: active ? 600 : 400, fontSize: 14, color: active ? s.text : colors.text }}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SYMPTOMS */}
          <div style={{ marginTop: 24, marginBottom: 28 }}>
            <Section label="How does it feel?" sub="Select all that apply" />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
              {DESCRIPTORS.map(desc => {
                const active = region.descriptors.includes(desc);
                return (
                  <button key={desc} onClick={() => toggleDesc(desc)} style={{
                    padding: '9px 18px', borderRadius: 999, outline: 'none', cursor: 'pointer',
                    border: `1.5px solid ${active ? colors.primary : '#E5E7EB'}`,
                    backgroundColor: active ? 'rgba(36,135,245,0.06)' : '#FFFFFF',
                    transition: 'all 0.15s',
                  }}>
                    <span style={{ fontFamily: font.body, fontWeight: active ? 600 : 400, fontSize: 14, color: active ? colors.primary : colors.text }}>
                      {active ? `✓ ${desc}` : desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 20px 36px', display: 'flex', gap: 10, borderTop: '1px solid #F3F4F6' }}>
          <button onClick={onRemove} style={{
            flex: '0 0 48px', padding: '15px 0', borderRadius: radius.button,
            border: '1px solid #FECACA', backgroundColor: '#FFF5F5', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="13" height="14" viewBox="0 0 13 14" fill="none">
              <path d="M1 3H12M4.5 3V2H8.5V3M2 3L3 12H10L11 3H2Z" stroke="#EF4444" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button onClick={onSave} disabled={!canSave} style={{
            flex: 1, padding: '15px 0', borderRadius: radius.button, border: 'none',
            backgroundColor: canSave ? colors.primary : '#E5E7EB',
            cursor: canSave ? 'pointer' : 'default',
            boxShadow: canSave ? '0 4px 14px rgba(36,135,245,0.3)' : 'none',
            fontFamily: font.heading, fontWeight: 700, fontSize: 15,
            color: canSave ? '#FFF' : '#9CA3AF',
            transition: 'all 0.18s',
          }}>
            Next →
          </button>
        </div>
      </div>
    </>
  );
}

function Section({ label, required, sub }: { label: string; required?: boolean; sub?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
      <p style={{ margin: 0, fontFamily: font.body, fontSize: 11, fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase', color: colors.textMuted }}>
        {label}{required && <span style={{ color: colors.red, marginLeft: 2 }}>*</span>}
      </p>
      {sub && <span style={{ fontFamily: font.body, fontSize: 11, color: colors.textMuted, fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>· {sub}</span>}
    </div>
  );
}
