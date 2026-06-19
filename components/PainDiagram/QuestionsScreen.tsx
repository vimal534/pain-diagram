import React from 'react';
import { SelectedRegion, PainStart, Duration, Pattern, DailyImpact } from '../../types/pain';
import { colors, radius, shadow, font, SEVERITY_COLORS } from './tokens';
import StatusBar from './StatusBar';

const BACK_ICON = 'https://www.figma.com/api/mcp/asset/b8710420-86dd-44df-b57e-d78318c03f58';

// Anatomy-specific aggravating factors — one entry per anatomyGroup
const ANATOMY_FACTORS: Record<string, string[]> = {
  head:     ['Bright light', 'Loud sounds', 'Stress', 'Morning', 'Physical activity', 'Screen time'],
  neck:     ['Looking down', 'Looking up', 'Driving', 'Sleeping position', 'Screen time', 'Turning head'],
  shoulder: ['Overhead motion', 'Sleeping on it', 'Sports / throwing', 'Lifting', 'Reaching behind', 'Pushing / pulling'],
  upperarm: ['Lifting overhead', 'Pushing', 'Throwing', 'Reaching', 'Sports / impact'],
  elbow:    ['Gripping', 'Lifting', 'Typing / keyboard', 'Throwing', 'Bending arm'],
  forearm:  ['Typing / keyboard', 'Heavy lifting', 'Sports', 'Fall / impact', 'Grip activities', 'Carrying'],
  wrist:    ['Typing', 'Lifting', 'Bending wrist', 'Gripping', 'Sports'],
  hand:     ['Gripping', 'Typing', 'Fine motor tasks', 'Cold weather', 'Carrying'],
  chest:    ['Deep breathing', 'Physical activity', 'At rest', 'After eating', 'At night'],
  abdomen:  ['After eating', 'Movement', 'At rest', 'Morning', 'After exercise'],
  pelvis:   ['Walking', 'Sitting', 'Standing long', 'Exercise', 'Morning stiffness'],
  hip:      ['Walking', 'Sitting long', 'Climbing stairs', 'Lying down', 'Getting up'],
  thigh:    ['Walking', 'Running', 'Climbing stairs', 'Sitting to standing', 'Exercise'],
  knee:     ['Going upstairs', 'Going downstairs', 'Running', 'Joint locking', 'Squatting'],
  calf:     ['Walking', 'Running', 'Standing long', 'Climbing stairs', 'Morning stiffness'],
  ankle:    ['Walking', 'Standing', 'Running', 'Swelling noted', 'Morning stiffness'],
  foot:     ['Walking', 'Standing long', 'First steps in morning', 'Running', 'Tight footwear'],
  back:     ['Bending forward', 'Sitting', 'Standing long', 'Morning', 'Lifting'],
};

const PAIN_STARTS: PainStart[] = ['After an injury', 'Exercise or lifting', 'Gradually over time', 'Woke up with pain', 'Not sure'];
const DURATIONS: Duration[] = ['Less than 24h', '1–7 days', '1–4 weeks', '1–6 months', 'More than 6 months'];
const PATTERNS: Pattern[] = ['Improving', 'Stable', 'Worsening'];
const IMPACTS: DailyImpact[] = ['None', 'Some', 'A lot', 'Unable'];

interface Props {
  regions: SelectedRegion[];
  onUpdate: (updated: SelectedRegion) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function QuestionsScreen({ regions, onUpdate, onBack, onNext }: Props) {
  const toggle = <T extends string>(arr: T[], val: T): T[] =>
    arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val];
  const single = <T extends string>(cur: T | null, val: T): T | null => cur === val ? null : val;

  return (
    <div style={{ backgroundColor: '#FFFFFF', display:'flex', flexDirection:'column', height:'100%', fontFamily: font.heading }}>
      <StatusBar />

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:12, padding:'6px 20px 12px' }}>
        <button onClick={onBack} style={iconBtn}>
          <img src={BACK_ICON} alt="Back" style={{ width:10, height:18, objectFit:'contain' }} />
        </button>
        <div>
          <h1 style={{ margin:0, fontWeight:800, fontSize:21, color: colors.text, letterSpacing:'-0.3px' }}>Tell us more</h1>
          <p style={{ margin:'2px 0 0', fontFamily: font.body, fontSize:13, color: colors.textSecondary }}>
            {regions.length} area{regions.length !== 1 ? 's' : ''} selected
          </p>
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex:1, overflowY:'auto', padding:'0 20px' }}>
        {regions.map((sr, idx) => {
          const factors = ANATOMY_FACTORS[sr.region.anatomyGroup] ?? ['Movement', 'Exercise', 'At rest', 'Morning stiffness', 'After activity'];
          const lvl = sr.painLevel ? SEVERITY_COLORS[sr.painLevel] : null;

          return (
            <div key={sr.region.id}>
              {/* Region header pill */}
              <div style={{ display:'flex', alignItems:'center', gap:8, margin:`${idx === 0 ? 0 : 24}px 0 14px` }}>
                <div style={{
                  display:'inline-flex', alignItems:'center', gap:7,
                  backgroundColor: lvl ? lvl.bg : colors.orangeBg,
                  border:`1px solid ${lvl ? lvl.border : colors.orange}`,
                  borderRadius:9999, padding:'5px 12px',
                }}>
                  {lvl && <span style={{ width:8, height:8, borderRadius:'50%', backgroundColor: lvl.dot, display:'inline-block' }} />}
                  <span style={{ fontFamily: font.heading, fontWeight:700, fontSize:13, color: colors.text }}>{sr.region.label}</span>
                </div>
                {idx < regions.length - 1 && <div style={{ flex:1, height:1, backgroundColor: colors.border }} />}
              </div>

              {/* Anatomy-specific aggravating factors */}
              <QuestionSection label={`What aggravates your ${sr.region.anatomyGroup} pain?`} multi>
                <ChipGroup
                  options={factors}
                  selected={sr.aggravatingFactors}
                  onToggle={v => onUpdate({ ...sr, aggravatingFactors: toggle(sr.aggravatingFactors, v) })}
                />
              </QuestionSection>

              {/* How did it start */}
              <QuestionSection label="How did the pain start?" multi>
                <ChipGroup
                  options={PAIN_STARTS}
                  selected={sr.starts}
                  onToggle={v => onUpdate({ ...sr, starts: toggle(sr.starts, v as PainStart) })}
                />
              </QuestionSection>

              {/* Duration */}
              <QuestionSection label="How long have you had this pain?">
                <ChipGroup
                  options={DURATIONS}
                  selected={sr.duration ? [sr.duration] : []}
                  onToggle={v => onUpdate({ ...sr, duration: single(sr.duration, v as Duration) })}
                />
              </QuestionSection>

              {/* Pattern */}
              <QuestionSection label="Is it getting better or worse?">
                <ChipGroup
                  options={PATTERNS}
                  selected={sr.pattern ? [sr.pattern] : []}
                  onToggle={v => onUpdate({ ...sr, pattern: single(sr.pattern, v as Pattern) })}
                />
              </QuestionSection>

              {/* Daily impact */}
              <QuestionSection label="How much does it affect daily activities?">
                <ChipGroup
                  options={IMPACTS}
                  selected={sr.dailyImpact ? [sr.dailyImpact] : []}
                  onToggle={v => onUpdate({ ...sr, dailyImpact: single(sr.dailyImpact, v as DailyImpact) })}
                />
              </QuestionSection>
            </div>
          );
        })}
        <div style={{ height:16 }} />
      </div>

      {/* Footer */}
      <div style={{ padding:'10px 20px 32px' }}>
        <button onClick={onNext} style={{
          width:'100%', padding:'17px 0', borderRadius: radius.button, border:'none',
          backgroundColor: colors.primary, cursor:'pointer', boxShadow: shadow.button,
          fontFamily: font.heading, fontWeight:700, fontSize:16, color:'#FFF',
        }}>
          Review my details  →
        </button>
      </div>
    </div>
  );
}

function QuestionSection({ label, children, multi }: { label: string; children: React.ReactNode; multi?: boolean }) {
  return (
    <div style={{ marginBottom:20 }}>
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <p style={{ margin:0, fontFamily: font.body, fontWeight:600, fontSize:11, letterSpacing:'0.5px', textTransform:'uppercase', color: colors.textMuted }}>
          {label}
        </p>
        {multi && <span style={{ fontFamily: font.body, fontSize:10, color: colors.primary, backgroundColor: colors.selectedBg, borderRadius:6, padding:'1px 6px', border:`1px solid ${colors.primary}30`, fontWeight:600 }}>multi</span>}
      </div>
      {children}
    </div>
  );
}

function ChipGroup({ options, selected, onToggle }: { options: string[]; selected: string[]; onToggle: (v: string) => void }) {
  return (
    <div style={{ display:'flex', flexWrap:'wrap', gap:8, paddingTop:10 }}>
      {options.map(opt => {
        const active = selected.includes(opt);
        return (
          <button key={opt} onClick={() => onToggle(opt)} style={{
            padding:'9px 15px', borderRadius: radius.chip, outline:'none', cursor:'pointer', minHeight:44,
            border:`1.5px solid ${active ? colors.primary : colors.border}`,
            backgroundColor: active ? colors.selectedBg : '#FFF',
            transition:'all 0.15s',
          }}>
            <span style={{ fontFamily: font.body, fontWeight:500, fontSize:14, color: active ? colors.primary : colors.text }}>
              {active ? `✓ ${opt}` : opt}
            </span>
          </button>
        );
      })}
    </div>
  );
}

const iconBtn: React.CSSProperties = {
  width:40, height:40, borderRadius:13, backgroundColor:'#FFF',
  border:`1px solid ${colors.border}`, display:'flex', alignItems:'center',
  justifyContent:'center', cursor:'pointer', flexShrink:0, boxShadow:'0 1px 4px rgba(0,0,0,0.06)',
};
