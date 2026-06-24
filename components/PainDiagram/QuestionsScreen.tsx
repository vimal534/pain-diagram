import React, { useState, useRef, useEffect } from 'react';
import { SelectedRegion, PainStart, Duration, Pattern, DailyImpact } from '../../types/pain';
import { colors, radius, shadow, font, SEVERITY_COLORS } from './tokens';
import StatusBar from './StatusBar';

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
  editingRegionId?: string | null;
  onUpdate: (updated: SelectedRegion) => void;
  onBack: () => void;
  onNext: () => void;
}

function isAnswered(sr: SelectedRegion, qi: number): boolean {
  if (qi === 0) return sr.aggravatingFactors.length > 0;
  if (qi === 1) return sr.starts.length > 0;
  if (qi === 2) return sr.duration !== null;
  if (qi === 3) return sr.pattern !== null;
  if (qi === 4) return sr.dailyImpact !== null;
  return false;
}

function summarise(sr: SelectedRegion, qi: number): string {
  if (qi === 0) {
    const f = sr.aggravatingFactors;
    return f.length <= 2 ? f.join(', ') : `${f.slice(0, 2).join(', ')} +${f.length - 2} more`;
  }
  if (qi === 1) return sr.starts.join(', ');
  if (qi === 2) return sr.duration ?? '';
  if (qi === 3) return sr.pattern ?? '';
  if (qi === 4) return sr.dailyImpact ?? '';
  return '';
}

export default function QuestionsScreen({ regions, editingRegionId, onUpdate, onBack, onNext }: Props) {
  const toggle = <T extends string>(arr: T[], val: T): T[] =>
    arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val];
  const single = <T extends string>(cur: T | null, val: T): T | null => cur === val ? null : val;

  const orderedRegions = [...regions].reverse();
  const initialIdx = editingRegionId
    ? Math.max(0, orderedRegions.findIndex(r => r.region.id === editingRegionId))
    : 0;
  const [currentIdx, setCurrentIdx] = useState(initialIdx);
  const [scrolled, setScrolled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const sr = orderedRegions[currentIdx];
  const isLastRegion = currentIdx === orderedRegions.length - 1;
  const lvl = sr?.painLevel ? SEVERITY_COLORS[sr.painLevel] : null;
  const factors = ANATOMY_FACTORS[sr?.region.anatomyGroup ?? ''] ?? ['Movement', 'Exercise', 'At rest', 'Morning stiffness', 'After activity'];

  const firstUnanswered = () => {
    if (!sr) return 0;
    for (let i = 0; i < 5; i++) if (!isAnswered(sr, i)) return i;
    return 4; // all answered — stay on last
  };

  const [activeQ, setActiveQ] = useState(firstUnanswered);

  useEffect(() => {
    setActiveQ(firstUnanswered());
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentIdx]);

  if (!sr) return null;

  const allAnswered = [0, 1, 2, 3, 4].every(i => isAnswered(sr, i));
  const activeAnswered = isAnswered(sr, activeQ);

  const questionLabels = [
    `What aggravates your ${sr.region.label.toLowerCase()} pain?`,
    'How did the pain start?',
    'How long have you had this pain?',
    'Is it getting better or worse?',
    'How much does it affect daily activities?',
  ];

  const questionContent = (qi: number) => {
    if (qi === 0) return (
      <ChipGroup options={factors} selected={sr.aggravatingFactors}
        onToggle={v => onUpdate({ ...sr, aggravatingFactors: toggle(sr.aggravatingFactors, v) })} />
    );
    if (qi === 1) return (
      <ChipGroup options={PAIN_STARTS} selected={sr.starts}
        onToggle={v => onUpdate({ ...sr, starts: toggle(sr.starts, v as PainStart) })} />
    );
    if (qi === 2) return (
      <ChipGroup options={DURATIONS} selected={sr.duration ? [sr.duration] : []}
        onToggle={v => onUpdate({ ...sr, duration: single(sr.duration, v as Duration) })} />
    );
    if (qi === 3) return (
      <ChipGroup options={PATTERNS} selected={sr.pattern ? [sr.pattern] : []}
        onToggle={v => onUpdate({ ...sr, pattern: single(sr.pattern, v as Pattern) })} />
    );
    if (qi === 4) return (
      <ChipGroup options={IMPACTS} selected={sr.dailyImpact ? [sr.dailyImpact] : []}
        onToggle={v => onUpdate({ ...sr, dailyImpact: single(sr.dailyImpact, v as DailyImpact) })} />
    );
    return null;
  };

  const handleContinue = () => {
    if (allAnswered) {
      if (isLastRegion) { onNext(); }
      else { setCurrentIdx(i => i + 1); }
      return;
    }
    // Advance to next unanswered
    let next = activeQ + 1;
    while (next < 5 && isAnswered(sr, next)) next++;
    if (next < 5) {
      setActiveQ(next);
      scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentIdx > 0) setCurrentIdx(i => i - 1);
    else onBack();
  };

  // Completed questions = answered AND not currently active
  const completedQs = [0, 1, 2, 3, 4].filter(i => isAnswered(sr, i) && i !== activeQ);

  const btnEnabled = activeAnswered;
  const btnLabel = allAnswered ? 'Review my details →' : 'Continue →';

  return (
    <div style={{ backgroundColor: '#F8FAFC', display: 'flex', flexDirection: 'column', height: '100%', fontFamily: font.heading }}>
      <StatusBar />

      {/* Header */}
      <div style={{
        padding: '10px 16px 14px', backgroundColor: '#FFFFFF', flexShrink: 0,
        borderBottom: scrolled ? '1px solid #E5E7EB' : '1px solid transparent',
        transition: 'border-color 0.15s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 12 }}>
          <button onClick={handleBack} style={backBtn}>
            <svg width="9" height="16" viewBox="0 0 9 16" fill="none">
              <path d="M8 1L1 8L8 15" stroke={colors.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div style={{ paddingTop: 2, flex: 1 }}>
            <h1 style={{ margin: 0, fontFamily: font.heading, fontWeight: 800, fontSize: 22, color: colors.text, letterSpacing: '-0.4px' }}>
              Tell us about your pain.
            </h1>
          </div>
        </div>

        {/* Region chip */}
        <div style={{ paddingLeft: 40 }}>
          {(() => {
            const dotColor = lvl?.dot ?? '#9CA3AF';
            const chipBg = lvl?.bg ?? '#F3F4F6';
            const chipBorder = lvl?.border ?? '#E5E7EB';
            return (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                backgroundColor: chipBg, border: `1px solid ${chipBorder}`,
                borderRadius: 999, padding: '6px 12px 6px 10px',
              }}>
                <span style={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: dotColor, display: 'inline-block', flexShrink: 0 }} />
                <span style={{ fontFamily: font.body, fontSize: 13, fontWeight: 600, color: colors.text }}>{sr.region.label}</span>
              </span>
            );
          })()}
        </div>
      </div>

      {/* Zone 1 — Active question (fixed, does not scroll) */}
      <div style={{
        backgroundColor: '#FFFFFF', flexShrink: 0,
        borderBottom: '1px solid #F0F1F5',
      }}>
        <div style={{ padding: '16px 16px 6px' }}>
          <p style={{ margin: '0 0 4px', fontFamily: font.body, fontSize: 11, fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase', color: colors.primary }}>
            Question {activeQ + 1} of 5
          </p>
          <p style={{ margin: 0, fontFamily: font.heading, fontWeight: 700, fontSize: 16, color: colors.text, lineHeight: 1.35 }}>
            {questionLabels[activeQ]}
          </p>
        </div>
        <div style={{ padding: '12px 16px 18px' }}>
          {questionContent(activeQ)}
        </div>
      </div>

      {/* Zone 2 — Scrollable answer log */}
      <div
        ref={scrollRef}
        onScroll={e => setScrolled((e.currentTarget as HTMLDivElement).scrollTop > 2)}
        style={{ flex: 1, overflowY: 'auto', padding: completedQs.length > 0 ? '14px 16px 12px' : '0' }}
      >
        {completedQs.length > 0 && (
          <>
            <p style={{ margin: '0 0 10px', fontFamily: font.body, fontSize: 11, fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase', color: colors.textMuted }}>
              Your answers
            </p>
            {completedQs.map(qi => (
              <div key={qi} style={{
                backgroundColor: '#FFFFFF', borderRadius: 14,
                border: '1px solid #F0F1F5',
                marginBottom: 8, padding: '11px 14px',
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                  backgroundColor: '#ECFDF5',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                    <path d="M1 3.5L3 5.5L8 1" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontFamily: font.body, fontSize: 11, color: colors.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                    {questionLabels[qi]}
                  </p>
                  <p style={{ margin: '2px 0 0', fontFamily: font.body, fontSize: 13, color: colors.text, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {summarise(sr, qi)}
                  </p>
                </div>
                <button onClick={() => setActiveQ(qi)} style={{
                  padding: '4px 10px', borderRadius: 8, border: '1px solid #E5E7EB',
                  backgroundColor: '#F8FAFC', cursor: 'pointer', flexShrink: 0,
                }}>
                  <span style={{ fontFamily: font.body, fontSize: 12, color: colors.textSecondary, fontWeight: 500 }}>Edit</span>
                </button>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Sticky footer */}
      <div style={{ padding: '8px 16px 28px', backgroundColor: '#FFFFFF', borderTop: '1px solid #F0F1F5' }}>
        <button
          onClick={btnEnabled ? handleContinue : undefined}
          style={{
            width: '100%', padding: '16px 0', borderRadius: radius.button, border: 'none',
            background: btnEnabled
              ? `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`
              : '#E5E7EB',
            cursor: btnEnabled ? 'pointer' : 'default',
            boxShadow: btnEnabled ? shadow.button : 'none',
            fontFamily: font.heading, fontWeight: 700, fontSize: 16,
            color: btnEnabled ? '#FFF' : '#9CA3AF',
            transition: 'all 0.2s ease',
          }}
        >
          {btnLabel}
        </button>
      </div>
    </div>
  );
}

function ChipGroup({ options, selected, onToggle }: { options: string[]; selected: string[]; onToggle: (v: string) => void }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {options.map(opt => {
        const active = selected.includes(opt);
        return (
          <button key={opt} onClick={() => onToggle(opt)} style={{
            padding: '9px 16px', borderRadius: radius.chip, outline: 'none', cursor: 'pointer', minHeight: 40,
            border: `1.5px solid ${active ? colors.primary : '#E5E7EB'}`,
            backgroundColor: active ? 'rgba(36,135,245,0.07)' : '#FAFAFA',
            transition: 'all 0.15s',
          }}>
            <span style={{ fontFamily: font.body, fontWeight: active ? 600 : 400, fontSize: 14, color: active ? colors.primary : colors.text }}>
              {opt}
            </span>
          </button>
        );
      })}
    </div>
  );
}

const backBtn: React.CSSProperties = {
  width: 32, height: 32, backgroundColor: 'transparent',
  border: 'none', display: 'flex', alignItems: 'center',
  justifyContent: 'center', cursor: 'pointer', flexShrink: 0, padding: 0,
};
