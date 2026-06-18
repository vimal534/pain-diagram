import React from 'react';
import { SelectedRegion, PainContextData, PainStart, Duration, Pattern, DailyImpact } from '../../types/pain';
import ChipSelector from './ChipSelector';

const ARROW_ICON = 'https://www.figma.com/api/mcp/asset/793f23b5-1dd4-4ada-877f-3a33a6c862e2';
const CHEVRON_LEFT = 'https://www.figma.com/api/mcp/asset/0d70d76a-c3f3-4479-a9aa-48dd867e856e';
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

const colors = {
  primary: '#2487F5',
  textPrimary: '#101828',
  textSecondary: '#6A7282',
  textMuted: '#99A1AF',
};

const sectionLabelStyle: React.CSSProperties = {
  fontFamily: 'Inter, sans-serif',
  fontWeight: 600,
  fontSize: 12,
  lineHeight: '16px',
  letterSpacing: '0.3px',
  textTransform: 'uppercase',
  color: colors.textSecondary,
  margin: 0,
};

function OrangePillTag({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#FFF7ED',
        borderRadius: 9999,
        padding: '4px 10px',
      }}
    >
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          backgroundColor: '#F97316',
          flexShrink: 0,
          display: 'inline-block',
        }}
      />
      <span
        style={{
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          fontWeight: 500,
          fontSize: 12,
          lineHeight: '16px',
          color: '#1E2939',
        }}
      >
        {label}
      </span>
      <button
        onClick={onRemove}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 13,
          height: 24,
          color: '#1E2939',
          fontFamily: 'Inter, sans-serif',
          fontSize: 16,
          lineHeight: '24px',
        }}
      >
        ×
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
    const typedVal = val as PainStart;
    const has = context.starts.includes(typedVal);
    onContextChange({
      ...context,
      starts: has ? context.starts.filter((s) => s !== typedVal) : [...context.starts, typedVal],
    });
  };

  const toggleDuration = (val: string) => {
    const typedVal = val as Duration;
    onContextChange({ ...context, duration: context.duration === typedVal ? null : typedVal });
  };

  const togglePattern = (val: string) => {
    const typedVal = val as Pattern;
    onContextChange({ ...context, pattern: context.pattern === typedVal ? null : typedVal });
  };

  const toggleImpact = (val: string) => {
    const typedVal = val as DailyImpact;
    onContextChange({ ...context, dailyImpact: context.dailyImpact === typedVal ? null : typedVal });
  };

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        fontFamily: 'Plus Jakarta Sans, sans-serif',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              width: 17,
              height: 22,
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <img src={CHEVRON_LEFT} alt="Back" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </button>
          <div>
            <h1
              style={{
                margin: 0,
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontWeight: 700,
                fontSize: 22,
                lineHeight: '32px',
                color: colors.textPrimary,
              }}
            >
              Tell us about your pain.
            </h1>
            <p
              style={{
                margin: '4px 0 0',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                fontSize: 14,
                lineHeight: '20px',
                color: colors.textSecondary,
              }}
            >
              Based on the areas you selected
            </p>
          </div>
        </div>

        {/* Yosi Logo */}
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: '#FFFFFF',
            border: '1px solid rgba(11, 165, 180, 0.14)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <img src={YOSI_LOGO} alt="Yosi" style={{ width: 34, height: 25, objectFit: 'contain' }} />
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }}>
        {/* Selected region pills */}
        {selectedRegions.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
            {selectedRegions.map((sr) => {
              const label = sr.exactSpot
                ? `${sr.region.label} - ${sr.exactSpot}`
                : sr.region.label;
              return (
                <OrangePillTag
                  key={sr.region.id}
                  label={label}
                  onRemove={() => onRemoveRegion(sr.region.id)}
                />
              );
            })}
          </div>
        )}

        {/* HOW DID THE PAIN START */}
        <div style={{ marginBottom: 20 }}>
          <p style={sectionLabelStyle}>How did the pain start?</p>
          <ChipSelector
            options={PAIN_STARTS}
            selected={context.starts}
            multiSelect
            onToggle={toggleStart}
          />
        </div>

        {/* DURATION */}
        <div style={{ marginBottom: 20 }}>
          <p style={sectionLabelStyle}>Duration</p>
          <ChipSelector
            options={DURATIONS}
            selected={context.duration ? [context.duration] : []}
            onToggle={toggleDuration}
          />
        </div>

        {/* PATTERN */}
        <div style={{ marginBottom: 20 }}>
          <p style={sectionLabelStyle}>Pattern</p>
          <ChipSelector
            options={PATTERNS}
            selected={context.pattern ? [context.pattern] : []}
            onToggle={togglePattern}
          />
        </div>

        {/* HOW MUCH DOES IT AFFECT DAILY ACTIVITIES */}
        <div style={{ marginBottom: 24 }}>
          <p style={sectionLabelStyle}>How much does it affect daily activities?</p>
          <ChipSelector
            options={DAILY_IMPACTS}
            selected={context.dailyImpact ? [context.dailyImpact] : []}
            onToggle={toggleImpact}
          />
        </div>
      </div>

      {/* Footer CTA */}
      <div style={{ padding: '16px 20px 18px' }}>
        <button
          onClick={onSubmit}
          style={{
            width: '100%',
            padding: '16px 0',
            borderRadius: 16,
            border: 'none',
            backgroundColor: colors.primary,
            cursor: 'pointer',
            outline: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
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
  );
}
