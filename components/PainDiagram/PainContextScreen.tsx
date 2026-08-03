import React from 'react';
import { SelectedRegion, PainContextData, PainStart, Duration, Pattern, DailyImpact } from '../../types/pain';
import { C } from './tokens';
import ChipSelector from './ChipSelector';

const YOSI_LOGO = 'https://www.figma.com/api/mcp/asset/82ce2c55-cf96-487b-ad3b-78d0c4cdecef';

const PAIN_STARTS: PainStart[] = [
  'After an injury or accident',
  'Direct impact',
  'After exercise or lifting',
  'Woke up with it',
  'Gradually over time',
  'Not sure',
];

const DURATIONS: Duration[] = [
  'Less than 24 hours',
  '1–7 days',
  '1–4 weeks',
  '1–6 months',
  'More than 6 months',
];

const PATTERNS: Pattern[] = ['Improving', 'Stable', 'Worsening'];
const DAILY_IMPACTS: DailyImpact[] = ['None', 'Some', 'A lot', 'Severely', 'Unable'];

interface Props {
  selectedRegions: SelectedRegion[];
  context: PainContextData;
  onContextChange: (ctx: PainContextData) => void;
  onBack: () => void;
  onSubmit: () => void;
  onRemoveRegion: (regionId: string) => void;
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

function RegionPill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        backgroundColor: C.primaryLight,
        border: `1px solid ${C.primaryBorder}`,
        borderRadius: 9999,
        padding: '5px 10px 5px 12px',
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: C.primary,
          flexShrink: 0,
          display: 'inline-block',
        }}
      />
      <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 500, fontSize: 13, color: C.textPrimary }}>
        {label}
      </span>
      <button
        onClick={onRemove}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          width: 18,
          height: 18,
        }}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={C.textSecondary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export default function PainContextScreen({
  selectedRegions,
  context,
  onContextChange,
  onBack,
  onSubmit,
  onRemoveRegion,
}: Props) {
  const toggleStart = (val: string) => {
    const v = val as PainStart;
    const has = context.starts.includes(v);
    onContextChange({ ...context, starts: has ? context.starts.filter((s) => s !== v) : [...context.starts, v] });
  };

  const toggleDuration = (val: string) => {
    const v = val as Duration;
    onContextChange({ ...context, duration: context.duration === v ? null : v });
  };

  const togglePattern = (val: string) => {
    const v = val as Pattern;
    onContextChange({ ...context, pattern: context.pattern === v ? null : v });
  };

  const toggleImpact = (val: string) => {
    const v = val as DailyImpact;
    onContextChange({ ...context, dailyImpact: context.dailyImpact === v ? null : v });
  };

  return (
    <div style={{ backgroundColor: C.bgPage, display: 'flex', flexDirection: 'column', height: '100%', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      {/* Header */}
      <div style={{ backgroundColor: C.bgCard, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 20px 16px', borderBottom: `1px solid ${C.borderLight}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={onBack}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, flexShrink: 0 }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.textPrimary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div>
            <h1 style={{ margin: 0, fontWeight: 700, fontSize: 20, lineHeight: '28px', color: C.textPrimary }}>
              Tell us about your pain.
            </h1>
            <p style={{ margin: '2px 0 0', fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 13, color: C.textSecondary }}>
              Based on the areas you selected
            </p>
          </div>
        </div>

        <div style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: C.bgCard, border: `1px solid ${C.primaryBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <img src={YOSI_LOGO} alt="Yosi" style={{ width: 30, height: 22, objectFit: 'contain' }} />
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>

        {/* Selected region pills */}
        {selectedRegions.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
            {selectedRegions.map((sr) => {
              const label = sr.exactSpot ? `${sr.region.label} — ${sr.exactSpot}` : sr.region.label;
              return (
                <RegionPill
                  key={sr.region.id}
                  label={label}
                  onRemove={() => onRemoveRegion(sr.region.id)}
                />
              );
            })}
          </div>
        )}

        {/* HOW DID THE PAIN START */}
        <div style={{ marginBottom: 22 }}>
          <p style={labelStyle}>How did the pain start?</p>
          <ChipSelector options={PAIN_STARTS} selected={context.starts} multiSelect onToggle={toggleStart} />
        </div>

        {/* DURATION */}
        <div style={{ marginBottom: 22 }}>
          <p style={labelStyle}>Duration</p>
          <ChipSelector options={DURATIONS} selected={context.duration ? [context.duration] : []} onToggle={toggleDuration} />
        </div>

        {/* PATTERN */}
        <div style={{ marginBottom: 22 }}>
          <p style={labelStyle}>Pattern</p>
          <ChipSelector options={PATTERNS} selected={context.pattern ? [context.pattern] : []} onToggle={togglePattern} />
        </div>

        {/* DAILY IMPACT */}
        <div style={{ marginBottom: 28 }}>
          <p style={labelStyle}>How much does it affect daily activities?</p>
          <ChipSelector options={DAILY_IMPACTS} selected={context.dailyImpact ? [context.dailyImpact] : []} onToggle={toggleImpact} />
        </div>
      </div>

      {/* Footer CTA */}
      <div style={{ padding: '12px 20px 24px', borderTop: `1px solid ${C.borderLight}`, backgroundColor: C.bgCard }}>
        <button
          onClick={onSubmit}
          style={{
            width: '100%',
            padding: '15px 0',
            borderRadius: 16,
            border: 'none',
            backgroundColor: C.primary,
            cursor: 'pointer',
            outline: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            boxShadow: '0 4px 12px rgba(13, 148, 136, 0.35)',
          }}
        >
          <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 16, color: '#FFFFFF' }}>
            Submit
          </span>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
