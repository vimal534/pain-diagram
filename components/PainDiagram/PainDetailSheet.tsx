import React, { useEffect, useState } from 'react';
import { SelectedRegion, PainLevel, PainDescriptor } from '../../types/pain';
import { colors, radius, font, SEVERITY_COLORS } from './tokens';

const SUB_REGIONS: Record<string, string[]> = {
  head:     ['Forehead', 'Temple (left)', 'Temple (right)', 'Top of head', 'Back of head', 'Behind ear'],
  neck:     ['Front of neck', 'Left side', 'Right side', 'Back of neck', 'Base of skull', 'Throat'],
  shoulder: ['Front of shoulder', 'Top of shoulder', 'Back of shoulder', 'Outer shoulder', 'Shoulder blade', 'Rotator cuff'],
  upperarm: ['Front (bicep)', 'Back (tricep)', 'Inner arm', 'Outer arm', 'Near shoulder', 'Near elbow'],
  elbow:    ['Outer elbow', 'Inner elbow', 'Back of elbow', 'Front of elbow', 'Elbow cap'],
  forearm:  ['Inner forearm', 'Outer forearm', 'Near elbow', 'Near wrist', 'Front', 'Back'],
  wrist:    ['Inner wrist', 'Outer wrist', 'Top of wrist', 'Palm side', 'Left side', 'Right side'],
  hand:     ['Palm', 'Back of hand', 'Thumb', 'Index finger', 'Middle finger', 'Pinky side'],
  chest:    ['Centre of chest', 'Left chest', 'Right chest', 'Upper chest', 'Lower chest', 'Under breastbone'],
  abdomen:  ['Upper abdomen', 'Lower abdomen', 'Left side', 'Right side', 'Around navel', 'Under ribs'],
  pelvis:   ['Lower abdomen', 'Groin (left)', 'Groin (right)', 'Hip joint', 'Tailbone / Coccyx', 'Pubic area'],
  hip:      ['Hip joint', 'Outer hip', 'Front of hip', 'Groin area', 'Buttock', 'Side of thigh'],
  thigh:    ['Front of thigh', 'Back of thigh', 'Inner thigh', 'Outer thigh', 'Near hip', 'Near knee'],
  knee:     ['Front (kneecap)', 'Inner knee', 'Outer knee', 'Back of knee', 'Below kneecap', 'Above kneecap'],
  calf:     ['Inner calf', 'Outer calf', 'Back of leg', 'Upper calf', 'Lower calf', 'Behind knee'],
  ankle:    ['Inner ankle', 'Outer ankle', 'Front of ankle', 'Back of ankle', 'Achilles tendon', 'Around the joint'],
  foot:     ['Heel', 'Arch', 'Ball of foot', 'Top of foot', 'Big toe', 'Outer toes'],
  back:     ['Upper back', 'Middle back', 'Lower back', 'Left side', 'Right side', 'Tailbone'],
};

const FALLBACK_SPOTS = ['Front', 'Back', 'Left side', 'Right side', 'Deep inside'];

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

  const subRegions = SUB_REGIONS[region.region.anatomyGroup] ?? FALLBACK_SPOTS;
  const setSpot = (s: string) => onUpdate({ ...region, exactSpot: region.exactSpot === s ? null : s });
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

          {/* SUB-REGION */}
          <Section label="Which part specifically?" />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
            {subRegions.map(spot => {
              const active = region.exactSpot === spot;
              return (
                <button key={spot} onClick={() => setSpot(spot)} style={{
                  padding: '9px 18px', borderRadius: 999, outline: 'none', cursor: 'pointer',
                  border: `1.5px solid ${active ? colors.primary : '#E5E7EB'}`,
                  backgroundColor: active ? 'rgba(36,135,245,0.06)' : '#FFFFFF',
                  transition: 'all 0.15s',
                }}>
                  <span style={{ fontFamily: font.body, fontWeight: active ? 600 : 400, fontSize: 14, color: active ? colors.primary : colors.text }}>
                    {spot}
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
                      {desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 20px 36px', borderTop: '1px solid #F3F4F6' }}>
          <button onClick={onSave} disabled={!canSave} style={{
            width: '100%', padding: '15px 0', borderRadius: radius.button, border: 'none',
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
