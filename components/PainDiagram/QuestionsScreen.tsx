import React from 'react';
import { SelectedRegion, PainStart, Duration, Pattern, DailyImpact, PainDescriptor } from '../../types/pain';
import { colors, radius, shadow, font } from './tokens';

const CHEVRON_LEFT = 'https://www.figma.com/api/mcp/asset/b8710420-86dd-44df-b57e-d78318c03f58';

const PAIN_STARTS: PainStart[] = ['After an injury', 'Exercise or lifting', 'Gradually over time', 'Woke up with pain', 'Not sure'];
const DURATIONS: Duration[] = ['Less than 24h', '1–7 days', '1–4 weeks', '1–6 months', 'More than 6 months'];
const PATTERNS: Pattern[] = ['Improving', 'Stable', 'Worsening'];
const IMPACTS: DailyImpact[] = ['None', 'Some', 'A lot', 'Unable'];
const DESCRIPTORS: PainDescriptor[] = ['Sharp', 'Burning', 'Stiffness', 'Throbbing', 'Tingling', 'Numbness'];

interface Props {
  region: SelectedRegion;
  onUpdate: (r: SelectedRegion) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function QuestionsScreen({ region, onUpdate, onBack, onNext }: Props) {
  const toggle = <T extends string>(arr: T[], val: T): T[] =>
    arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];

  const single = <T extends string>(cur: T | null, val: T): T | null =>
    cur === val ? null : val;

  return (
    <div style={{ backgroundColor: colors.bg, display: 'flex', flexDirection: 'column', height: '100%', fontFamily: font.heading }}>
      <StatusBar />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 20px 16px' }}>
        <button onClick={onBack} style={iconBtnStyle}>
          <img src={CHEVRON_LEFT} alt="Back" style={{ width: 10, height: 18, objectFit: 'contain' }} />
        </button>
        <div>
          <h1 style={{ margin: 0, fontWeight: 800, fontSize: 22, color: colors.text, letterSpacing: '-0.3px' }}>
            Tell us more
          </h1>
          <p style={{ margin: '2px 0 0', fontFamily: font.body, fontSize: 13, color: colors.textSecondary }}>
            {region.region.label}
            {region.exactSpot ? ` · ${region.exactSpot}` : ''}
            {region.painLevel ? ` · ${cap(region.painLevel)}` : ''}
          </p>
        </div>
      </div>

      {/* Scrollable questions */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }}>
        <Section label="How did the pain start?" multi>
          <ChipGroup
            options={PAIN_STARTS}
            selected={region.starts}
            onToggle={(v) => onUpdate({ ...region, starts: toggle(region.starts, v as PainStart) })}
          />
        </Section>

        <Section label="Duration" >
          <ChipGroup
            options={DURATIONS}
            selected={region.duration ? [region.duration] : []}
            onToggle={(v) => onUpdate({ ...region, duration: single(region.duration, v as Duration) })}
          />
        </Section>

        <Section label="Pattern">
          <ChipGroup
            options={PATTERNS}
            selected={region.pattern ? [region.pattern] : []}
            onToggle={(v) => onUpdate({ ...region, pattern: single(region.pattern, v as Pattern) })}
          />
        </Section>

        <Section label="Impact on daily activities">
          <ChipGroup
            options={IMPACTS}
            selected={region.dailyImpact ? [region.dailyImpact] : []}
            onToggle={(v) => onUpdate({ ...region, dailyImpact: single(region.dailyImpact, v as DailyImpact) })}
          />
        </Section>

        <Section label="Describe your pain" multi>
          <ChipGroup
            options={DESCRIPTORS}
            selected={region.descriptors}
            onToggle={(v) => onUpdate({ ...region, descriptors: toggle(region.descriptors, v as PainDescriptor) })}
          />
        </Section>

        <div style={{ height: 16 }} />
      </div>

      {/* Footer */}
      <div style={{ padding: '12px 20px 28px' }}>
        <button onClick={onNext} style={{
          width: '100%', padding: '17px 0', borderRadius: radius.button, border: 'none',
          backgroundColor: colors.primary, cursor: 'pointer', boxShadow: shadow.button,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <span style={{ fontFamily: font.heading, fontWeight: 700, fontSize: 16, color: '#FFFFFF' }}>
            Review  →
          </span>
        </button>
      </div>
    </div>
  );
}

function Section({ label, children, multi }: { label: string; children: React.ReactNode; multi?: boolean }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 0 }}>
        <p style={{ margin: 0, fontFamily: font.body, fontWeight: 600, fontSize: 11, letterSpacing: '0.55px', textTransform: 'uppercase', color: colors.textMuted }}>
          {label}
        </p>
        {multi && <span style={{ fontFamily: font.body, fontSize: 10, color: colors.textMuted, backgroundColor: colors.bg, borderRadius: 6, padding: '1px 5px', border: `1px solid ${colors.border}` }}>multi-select</span>}
      </div>
      {children}
    </div>
  );
}

function ChipGroup({ options, selected, onToggle }: { options: string[]; selected: string[]; onToggle: (v: string) => void }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingTop: 10 }}>
      {options.map((opt) => {
        const active = selected.includes(opt);
        return (
          <button key={opt} onClick={() => onToggle(opt)} style={{
            padding: '9px 15px', borderRadius: radius.chip, outline: 'none', cursor: 'pointer',
            border: `1.5px solid ${active ? colors.primary : colors.border}`,
            backgroundColor: active ? colors.selectedBg : '#FFFFFF',
            transition: 'all 0.15s',
          }}>
            <span style={{ fontFamily: font.body, fontWeight: 500, fontSize: 14, color: active ? colors.primary : colors.text }}>
              {active ? `✓ ${opt}` : opt}
            </span>
          </button>
        );
      })}
    </div>
  );
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const iconBtnStyle: React.CSSProperties = {
  width: 36, height: 36, borderRadius: 12, backgroundColor: '#FFFFFF',
  border: `1px solid ${colors.border}`, display: 'flex', alignItems: 'center',
  justifyContent: 'center', cursor: 'pointer', flexShrink: 0,
  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
};

function StatusBar() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px 4px', flexShrink: 0 }}>
      <span style={{ fontFamily: font.body, fontWeight: 600, fontSize: 15, color: colors.text }}>9:41</span>
      <div style={{ display: 'flex', gap: 5, fontSize: 12, color: colors.text }}>
        <span>▐▐▐</span><span>WiFi</span><span>🔋</span>
      </div>
    </div>
  );
}
