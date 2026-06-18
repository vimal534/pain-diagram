import React, { useState } from 'react';
import { SelectedRegion } from '../../types/pain';
import { colors, radius, shadow, font } from './tokens';

const CHEVRON_LEFT = 'https://www.figma.com/api/mcp/asset/b8710420-86dd-44df-b57e-d78318c03f58';

const LEVEL_COLOR: Record<string, string> = {
  mild: '#EAB308',
  moderate: '#F97316',
  severe: '#EF4444',
};

interface Props {
  selectedRegions: SelectedRegion[];
  onBack: () => void;
  onAddAnother: () => void;
  onEditRegion: (id: string) => void;
  onDeleteRegion: (id: string) => void;
  onSubmit: () => void;
}

export default function ReviewScreen({ selectedRegions, onBack, onAddAnother, onEditRegion, onDeleteRegion, onSubmit }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(
    selectedRegions[0]?.region.id ?? null
  );

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
            Review your pain details
          </h1>
          <p style={{ margin: '2px 0 0', fontFamily: font.body, fontSize: 13, color: colors.textSecondary }}>
            {selectedRegions.length} area{selectedRegions.length !== 1 ? 's' : ''} selected
          </p>
        </div>
      </div>

      {/* Cards */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {selectedRegions.map((sr) => {
            const isExpanded = expandedId === sr.region.id;
            const levelColor = sr.painLevel ? LEVEL_COLOR[sr.painLevel] : colors.textMuted;
            return (
              <div
                key={sr.region.id}
                style={{
                  backgroundColor: colors.cardBg,
                  borderRadius: radius.card,
                  boxShadow: shadow.card,
                  overflow: 'hidden',
                  border: isExpanded ? `1.5px solid ${colors.primary}` : `1.5px solid transparent`,
                  transition: 'border-color 0.2s',
                }}
              >
                {/* Card header — always visible */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : sr.region.id)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '16px 18px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {sr.painLevel && (
                      <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: levelColor, flexShrink: 0 }} />
                    )}
                    <div>
                      <p style={{ margin: 0, fontFamily: font.heading, fontWeight: 700, fontSize: 15, color: colors.text }}>
                        {sr.region.label}
                      </p>
                      <p style={{ margin: '2px 0 0', fontFamily: font.body, fontSize: 12, color: colors.textSecondary }}>
                        {[sr.exactSpot, sr.painLevel ? cap(sr.painLevel) : null].filter(Boolean).join(' · ')}
                        {sr.duration ? ` · ${sr.duration}` : ''}
                        {sr.pattern ? ` · ${sr.pattern}` : ''}
                        {sr.descriptors.length ? ` · ${sr.descriptors.slice(0, 2).join(', ')}` : ''}
                      </p>
                    </div>
                  </div>
                  <span style={{ fontSize: 18, color: colors.textMuted, transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                    ⌄
                  </span>
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <div style={{ padding: '0 18px 18px', borderTop: `1px solid ${colors.bg}` }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 14 }}>
                      {sr.exactSpot && <Row label="Location" value={sr.exactSpot} />}
                      {sr.painLevel && <Row label="Pain Level" value={cap(sr.painLevel)} dot={levelColor} />}
                      {sr.duration && <Row label="Duration" value={sr.duration} />}
                      {sr.pattern && <Row label="Pattern" value={sr.pattern} />}
                      {sr.dailyImpact && <Row label="Daily Impact" value={sr.dailyImpact} />}
                      {sr.descriptors.length > 0 && (
                        <div>
                          <p style={{ margin: '0 0 6px', fontFamily: font.body, fontSize: 11, fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', color: colors.textMuted }}>Symptoms</p>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {sr.descriptors.map((d) => (
                              <span key={d} style={{ padding: '4px 12px', borderRadius: 9999, backgroundColor: colors.selectedBg, border: `1px solid ${colors.primary}`, fontFamily: font.body, fontSize: 12, color: colors.primary, fontWeight: 500 }}>
                                {d}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {sr.starts.length > 0 && (
                        <div>
                          <p style={{ margin: '0 0 6px', fontFamily: font.body, fontSize: 11, fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', color: colors.textMuted }}>How it started</p>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {sr.starts.map((s) => (
                              <span key={s} style={{ padding: '4px 12px', borderRadius: 9999, backgroundColor: colors.bg, border: `1px solid ${colors.border}`, fontFamily: font.body, fontSize: 12, color: colors.text }}>
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Edit/Delete */}
                    <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                      <button onClick={() => onEditRegion(sr.region.id)} style={{
                        flex: 1, padding: '10px 0', borderRadius: 12, border: `1.5px solid ${colors.border}`,
                        backgroundColor: '#FFFFFF', cursor: 'pointer', fontFamily: font.heading, fontWeight: 600, fontSize: 13, color: colors.text,
                      }}>
                        Edit
                      </button>
                      <button onClick={() => onDeleteRegion(sr.region.id)} style={{
                        flex: 1, padding: '10px 0', borderRadius: 12, border: '1.5px solid #FFC9C9',
                        backgroundColor: '#FFF5F5', cursor: 'pointer', fontFamily: font.heading, fontWeight: 600, fontSize: 13, color: '#EF4444',
                      }}>
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Add another */}
          <button onClick={onAddAnother} style={{
            width: '100%', padding: '15px 0', borderRadius: radius.card,
            border: `1.5px dashed ${colors.primary}`, backgroundColor: 'rgba(36,135,245,0.04)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <span style={{ fontSize: 18, color: colors.primary }}>+</span>
            <span style={{ fontFamily: font.heading, fontWeight: 600, fontSize: 14, color: colors.primary }}>
              Add another pain area
            </span>
          </button>

          <div style={{ height: 8 }} />
        </div>
      </div>

      {/* Continue */}
      <div style={{ padding: '12px 20px 28px' }}>
        <button onClick={onSubmit} style={{
          width: '100%', padding: '17px 0', borderRadius: radius.button, border: 'none',
          backgroundColor: colors.primary, cursor: 'pointer', boxShadow: shadow.button,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <span style={{ fontFamily: font.heading, fontWeight: 700, fontSize: 16, color: '#FFFFFF' }}>
            Continue  →
          </span>
        </button>
      </div>
    </div>
  );
}

function Row({ label, value, dot }: { label: string; value: string; dot?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <p style={{ margin: 0, fontFamily: font.body, fontSize: 13, color: colors.textSecondary }}>{label}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {dot && <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: dot, display: 'inline-block' }} />}
        <p style={{ margin: 0, fontFamily: font.body, fontWeight: 500, fontSize: 13, color: colors.text }}>{value}</p>
      </div>
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
