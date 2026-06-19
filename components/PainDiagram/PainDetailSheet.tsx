import React, { useEffect, useState } from 'react';
import { SelectedRegion, ExactSpot, PainLevel, PainDescriptor } from '../../types/pain';
import { colors, radius, shadow, font, SEVERITY_COLORS } from './tokens';

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
        position:'absolute', inset:0, zIndex:30,
        backgroundColor:'rgba(0,0,0,0.35)',
        opacity: visible ? 1 : 0, transition:'opacity 0.28s ease',
      }} />

      {/* Sheet */}
      <div style={{
        position:'absolute', bottom:0, left:0, right:0, zIndex:40,
        backgroundColor:'#FFF',
        borderRadius:`${radius.sheet}px ${radius.sheet}px 0 0`,
        boxShadow: shadow.sheet,
        transform: visible ? 'translateY(0)' : 'translateY(100%)',
        transition:'transform 0.36s cubic-bezier(0.32,0.72,0,1)',
        display:'flex', flexDirection:'column', maxHeight:'88%',
      }}>
        {/* Handle */}
        <div style={{ display:'flex', justifyContent:'center', paddingTop:12, paddingBottom:2 }}>
          <div style={{ width:40, height:4, borderRadius:2, backgroundColor: colors.border }} />
        </div>

        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', padding:'10px 20px 0' }}>
          <div>
            <p style={{ margin:0, fontFamily: font.heading, fontWeight:800, fontSize:19, color: colors.text }}>{region.region.label}</p>
            <p style={{ margin:'3px 0 0', fontFamily: font.body, fontSize:13, color: colors.textSecondary }}>Refine the spot & how it feels</p>
          </div>
          <button onClick={onClose} style={{
            width:34, height:34, borderRadius:'50%', backgroundColor: colors.bg,
            border:'none', cursor:'pointer', fontSize:20, color: colors.textSecondary,
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>×</button>
        </div>

        {/* Scrollable body */}
        <div style={{ flex:1, overflowY:'auto', padding:'0 20px' }}>

          {/* EXACT SPOT */}
          <SectionLabel>Exact Spot</SectionLabel>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8, paddingTop:10 }}>
            {EXACT_SPOTS.map(spot => {
              const active = region.exactSpot === spot;
              return (
                <Chip key={spot} label={spot} active={active} onClick={() => setSpot(spot)}
                  activeBg={colors.selectedBg} activeBorder={colors.primary} activeText={colors.primary} />
              );
            })}
          </div>

          {/* PAIN SEVERITY */}
          <div style={{ marginTop:22 }}>
            <SectionLabel>Pain Severity <Req /></SectionLabel>
            <div style={{ display:'flex', gap:8, paddingTop:10 }}>
              {(['mild','moderate','severe'] as PainLevel[]).map(level => {
                const s = SEVERITY_COLORS[level];
                const active = region.painLevel === level;
                return (
                  <button key={level} onClick={() => setLevel(level)} style={{
                    flex:1, padding:'12px 4px', borderRadius: radius.chip, outline:'none', cursor:'pointer',
                    border:`1.5px solid ${active ? s.border : colors.border}`,
                    backgroundColor: active ? s.bg : '#FFF',
                    display:'flex', alignItems:'center', justifyContent:'center', gap:7, transition:'all 0.15s',
                    minHeight:48,
                  }}>
                    <span style={{ width:10, height:10, borderRadius:'50%', backgroundColor: s.dot, display:'inline-block', flexShrink:0 }} />
                    <span style={{ fontFamily: font.heading, fontWeight:700, fontSize:14, color: active ? s.text : colors.textSecondary }}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SYMPTOMS */}
          <div style={{ marginTop:22, marginBottom:28 }}>
            <SectionLabel>Symptoms <span style={{ fontWeight:400, textTransform:'lowercase', letterSpacing:0 }}>(select all that apply)</span></SectionLabel>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8, paddingTop:10 }}>
              {DESCRIPTORS.map(desc => {
                const active = region.descriptors.includes(desc);
                return (
                  <Chip key={desc} label={desc} active={active} onClick={() => toggleDesc(desc)}
                    activeBg={colors.selectedBg} activeBorder={colors.primary} activeText={colors.primary} />
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div style={{ padding:'16px 20px 32px', display:'flex', gap:10, borderTop:`1px solid ${colors.bg}` }}>
          <button onClick={onRemove} style={{
            flex:'0 0 110px', padding:'15px 0', borderRadius: radius.button,
            border:'1.5px solid #FECACA', backgroundColor:'transparent', cursor:'pointer',
            fontFamily: font.heading, fontWeight:700, fontSize:14, color:'#EF4444',
          }}>
            Remove
          </button>
          <button onClick={onSave} disabled={!canSave} style={{
            flex:1, padding:'15px 0', borderRadius: radius.button, border:'none',
            backgroundColor: canSave ? colors.primary : colors.border,
            cursor: canSave ? 'pointer' : 'not-allowed',
            boxShadow: canSave ? shadow.button : 'none',
            fontFamily: font.heading, fontWeight:700, fontSize:16, color:'#FFF',
            transition:'all 0.18s',
          }}>
            Save  ✓
          </button>
        </div>
      </div>
    </>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ margin:'20px 0 0', fontFamily: font.body, fontWeight:600, fontSize:11, letterSpacing:'0.55px', textTransform:'uppercase', color: colors.textMuted }}>
      {children}
    </p>
  );
}

function Req() {
  return <span style={{ color: colors.red, marginLeft:2 }}>*</span>;
}

function Chip({ label, active, onClick, activeBg, activeBorder, activeText }: {
  label: string; active: boolean; onClick: () => void;
  activeBg: string; activeBorder: string; activeText: string;
}) {
  return (
    <button onClick={onClick} style={{
      padding:'10px 16px', borderRadius: radius.chip, outline:'none', cursor:'pointer',
      border:`1.5px solid ${active ? activeBorder : colors.border}`,
      backgroundColor: active ? activeBg : '#FFF',
      transition:'all 0.15s', minHeight:44,
    }}>
      <span style={{ fontFamily: font.body, fontWeight:500, fontSize:14, color: active ? activeText : colors.text }}>
        {active ? `✓ ${label}` : label}
      </span>
    </button>
  );
}
