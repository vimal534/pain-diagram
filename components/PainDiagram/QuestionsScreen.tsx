import React, { useState, useRef } from 'react';
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

export default function QuestionsScreen({ regions, editingRegionId, onUpdate, onBack, onNext }: Props) {
  const toggle = <T extends string>(arr: T[], val: T): T[] =>
    arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val];
  const single = <T extends string>(cur: T | null, val: T): T | null => cur === val ? null : val;

  // Most recently selected first
  const orderedRegions = [...regions].reverse();

  const initialIdx = editingRegionId
    ? Math.max(0, orderedRegions.findIndex(r => r.region.id === editingRegionId))
    : 0;
  const [currentIdx, setCurrentIdx] = useState(initialIdx);
  const [scrolled, setScrolled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const isLast = currentIdx === orderedRegions.length - 1;
  const sr = orderedRegions[currentIdx];
  const lvl = sr?.painLevel ? SEVERITY_COLORS[sr.painLevel] : null;
  const factors = ANATOMY_FACTORS[sr?.region.anatomyGroup ?? ''] ?? ['Movement', 'Exercise', 'At rest', 'Morning stiffness', 'After activity'];

  const hasAnswer = sr && (
    sr.aggravatingFactors.length > 0 || sr.starts.length > 0 ||
    sr.duration !== null || sr.pattern !== null || sr.dailyImpact !== null
  );

  // Advance counter each time a question gets its first answer
  const answeredCount = sr ? [
    sr.aggravatingFactors.length > 0,
    sr.starts.length > 0,
    sr.duration !== null,
    sr.pattern !== null,
    sr.dailyImpact !== null,
  ].filter(Boolean).length : 0;
  const activeQuestion = Math.min(5, answeredCount + 1);

  const handleNext = () => {
    if (isLast || hasAnswer) {
      onNext();
    } else {
      setCurrentIdx(i => i + 1);
      scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentIdx > 0) {
      setCurrentIdx(i => i - 1);
      scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onBack();
    }
  };

  if (!sr) return null;

  return (
    <div style={{ backgroundColor: '#F8FAFC', display: 'flex', flexDirection: 'column', height: '100%', fontFamily: font.heading }}>
      <StatusBar />

      {/* Header */}
      <div style={{
        padding: '10px 16px 14px',
        backgroundColor: '#FFFFFF', flexShrink: 0,
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
            <p style={{ margin: '3px 0 0', fontFamily: font.body, fontSize: 13, color: colors.textSecondary }}>
              Question {activeQuestion} of 5
            </p>
          </div>

          {/* Step dots */}
          {orderedRegions.length > 1 && (
            <div style={{ display: 'flex', gap: 5, alignItems: 'center', paddingTop: 6 }}>
              {orderedRegions.map((_, i) => (
                <div key={i} style={{
                  width: i === currentIdx ? 18 : 6,
                  height: 6, borderRadius: 999,
                  backgroundColor: i === currentIdx ? colors.primary : i < currentIdx ? colors.primary : '#E5E7EB',
                  opacity: i < currentIdx ? 0.4 : 1,
                  transition: 'all 0.25s ease',
                }} />
              ))}
            </div>
          )}
        </div>

        {/* Active region chip */}
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
                <span style={{ fontFamily: font.body, fontSize: 13, fontWeight: 600, color: colors.text }}>
                  {sr.region.label}
                </span>
              </span>
            );
          })()}
        </div>
      </div>

      {/* Scrollable questions for current area only */}
      <div
        ref={scrollRef}
        onScroll={e => setScrolled((e.currentTarget as HTMLDivElement).scrollTop > 2)}
        style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 16px' }}
      >
        <QuestionCard ref={el => { questionRefs.current[0] = el; }} label={`What aggravates your ${sr.region.label.toLowerCase()} pain?`}>
          <ChipGroup options={factors} selected={sr.aggravatingFactors}
            onToggle={v => onUpdate({ ...sr, aggravatingFactors: toggle(sr.aggravatingFactors, v) })} />
        </QuestionCard>

        <QuestionCard ref={el => { questionRefs.current[1] = el; }} label="How did the pain start?">
          <ChipGroup options={PAIN_STARTS} selected={sr.starts}
            onToggle={v => onUpdate({ ...sr, starts: toggle(sr.starts, v as PainStart) })} />
        </QuestionCard>

        <QuestionCard ref={el => { questionRefs.current[2] = el; }} label="How long have you had this pain?">
          <ChipGroup options={DURATIONS} selected={sr.duration ? [sr.duration] : []}
            onToggle={v => onUpdate({ ...sr, duration: single(sr.duration, v as Duration) })} />
        </QuestionCard>

        <QuestionCard ref={el => { questionRefs.current[3] = el; }} label="Is it getting better or worse?">
          <ChipGroup options={PATTERNS} selected={sr.pattern ? [sr.pattern] : []}
            onToggle={v => onUpdate({ ...sr, pattern: single(sr.pattern, v as Pattern) })} />
        </QuestionCard>

        <QuestionCard ref={el => { questionRefs.current[4] = el; }} label="How much does it affect daily activities?">
          <ChipGroup options={IMPACTS} selected={sr.dailyImpact ? [sr.dailyImpact] : []}
            onToggle={v => onUpdate({ ...sr, dailyImpact: single(sr.dailyImpact, v as DailyImpact) })} />
        </QuestionCard>
      </div>

      {/* Footer */}
      <div style={{ padding: '8px 16px 28px', backgroundColor: '#FFFFFF', borderTop: '1px solid #F0F1F5' }}>
        <button onClick={handleNext} style={{
          width: '100%', padding: '16px 0', borderRadius: radius.button, border: 'none',
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
          cursor: 'pointer', boxShadow: shadow.button,
          fontFamily: font.heading, fontWeight: 700, fontSize: 16, color: '#FFF',
        }}>
          {hasAnswer || isLast ? 'Review my details →' : `Next: ${orderedRegions[currentIdx + 1]?.region.label} →`}
        </button>
      </div>
    </div>
  );
}

const QuestionCard = React.forwardRef<HTMLDivElement, { label: string; children: React.ReactNode }>(
  function QuestionCard({ label, children }, ref) {
  return (
    <div ref={ref} style={{
      backgroundColor: '#FFFFFF', borderRadius: 18,
      boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 4px 14px rgba(0,0,0,0.06)',
      marginBottom: 12, overflow: 'hidden',
    }}>
      <div style={{ padding: '16px 16px 14px' }}>
        <p style={{ margin: 0, fontFamily: font.heading, fontWeight: 700, fontSize: 15, color: colors.text, lineHeight: 1.35 }}>
          {label}
        </p>
      </div>
      <div style={{ height: 1, backgroundColor: '#F0F1F5' }} />
      <div style={{ padding: '14px 16px 16px' }}>
        {children}
      </div>
    </div>
  );
});

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
              {active ? `✓ ${opt}` : opt}
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
