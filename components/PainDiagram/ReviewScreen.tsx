import React, { useState } from 'react';
import { SelectedRegion } from '../../types/pain';
import { colors, radius, shadow, font, SEVERITY_COLORS } from './tokens';
import StatusBar from './StatusBar';

const BACK_ICON = 'https://www.figma.com/api/mcp/asset/b8710420-86dd-44df-b57e-d78318c03f58';

const ANATOMY_ICONS: Record<string, string> = {
  shoulder:'💪', arm:'🦾', chest:'🫁', abdomen:'🫃',
  hip:'🦴', knee:'🦵', ankle:'🦶', back:'🔙', neck:'🧠', head:'🧠',
};

const IMPACT_LABELS: Record<string, string> = {
  None: 'No daily impact',
  Some: 'Some impact on daily activities',
  'A lot': 'Significantly limits daily life',
  Unable: 'Unable to perform normal activities',
};

const PATTERN_LABELS: Record<string, string> = {
  Improving: 'Getting better over time',
  Stable:    'Staying the same',
  Worsening: 'Getting worse over time',
};

interface Props {
  selectedRegions: SelectedRegion[];
  onBack: () => void;
  onEditRegion: (id: string) => void;
  onDeleteRegion: (id: string) => void;
  onAddAnother: () => void;
  onSubmit: () => void;
}

export default function ReviewScreen({
  selectedRegions, onBack, onEditRegion, onDeleteRegion, onAddAnother, onSubmit,
}: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(selectedRegions[0]?.region.id ?? null);

  return (
    <div style={{ backgroundColor:'#FFFFFF', display:'flex', flexDirection:'column', height:'100%', fontFamily: font.heading }}>
      <StatusBar />

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:12, padding:'6px 20px 12px' }}>
        <button onClick={onBack} style={iconBtn}>
          <img src={BACK_ICON} alt="Back" style={{ width:10, height:18, objectFit:'contain' }} />
        </button>
        <div>
          <h1 style={{ margin:0, fontWeight:800, fontSize:21, color: colors.text, letterSpacing:'-0.3px' }}>Review your pain details</h1>
          <p style={{ margin:'2px 0 0', fontFamily: font.body, fontSize:13, color: colors.textSecondary }}>
            {selectedRegions.length} pain area{selectedRegions.length !== 1 ? 's' : ''} recorded · tap to expand
          </p>
        </div>
      </div>

      {/* Cards */}
      <div style={{ flex:1, overflowY:'auto', padding:'0 20px' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {selectedRegions.map(sr => {
            const lvl = sr.painLevel ? SEVERITY_COLORS[sr.painLevel] : null;
            const isExpanded = expandedId === sr.region.id;
            const icon = ANATOMY_ICONS[sr.region.anatomyGroup] ?? '🩺';

            // Build a human-readable summary line
            const summaryParts: string[] = [];
            if (sr.exactSpot)    summaryParts.push(sr.exactSpot);
            if (sr.duration)     summaryParts.push(sr.duration);
            if (sr.pattern)      summaryParts.push(PATTERN_LABELS[sr.pattern] ?? sr.pattern);
            if (sr.descriptors.length) summaryParts.push(sr.descriptors.slice(0, 3).join(', '));

            return (
              <div key={sr.region.id} style={{
                backgroundColor:'#FFFFFF',
                borderRadius: radius.card,
                border: isExpanded ? `1.5px solid ${colors.primary}` : `1.5px solid ${colors.border}`,
                overflow:'hidden',
                boxShadow: isExpanded ? `0 4px 24px rgba(36,135,245,0.12)` : '0 1px 8px rgba(0,0,0,0.05)',
                transition:'border-color 0.2s, box-shadow 0.2s',
              }}>
                {/* Collapsed header */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : sr.region.id)}
                  style={{ width:'100%', display:'flex', alignItems:'center', gap:14, padding:'16px 18px', background:'none', border:'none', cursor:'pointer', textAlign:'left' }}
                >
                  {/* Icon thumbnail */}
                  <div style={{
                    width:52, height:52, borderRadius:16, flexShrink:0,
                    backgroundColor: lvl ? lvl.bg : '#F3F4F6',
                    border:`1.5px solid ${lvl ? lvl.border : colors.border}`,
                    display:'flex', alignItems:'center', justifyContent:'center', fontSize:24,
                  }}>
                    {icon}
                  </div>

                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4, flexWrap:'wrap' }}>
                      <span style={{ fontFamily: font.heading, fontWeight:800, fontSize:15, color: colors.text }}>{sr.region.label}</span>
                      {lvl && (
                        <span style={{
                          fontFamily: font.body, fontWeight:700, fontSize:11,
                          color: lvl.text, backgroundColor: lvl.bg,
                          border:`1px solid ${lvl.border}`, borderRadius:6, padding:'2px 8px',
                          textTransform:'capitalize',
                        }}>
                          {sr.painLevel} pain
                        </span>
                      )}
                    </div>
                    <p style={{ margin:0, fontFamily: font.body, fontSize:12, color: colors.textSecondary, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                      {summaryParts.length ? summaryParts.join(' · ') : 'Tap to review details'}
                    </p>
                  </div>
                  <span style={{ fontSize:16, color: colors.textMuted, transform: isExpanded ? 'rotate(180deg)' : 'none', transition:'transform 0.2s', flexShrink:0 }}>⌄</span>
                </button>

                {/* Expanded detail */}
                {isExpanded && (
                  <div style={{ borderTop:`1px solid ${colors.bg}`, padding:'16px 18px 18px' }}>

                    {/* Section: Location & severity */}
                    <SectionHead>Location & Severity</SectionHead>
                    <div style={{ display:'flex', flexDirection:'column', gap:9, marginBottom:16 }}>
                      {sr.exactSpot && (
                        <DetailRow label="Exact location" value={sr.exactSpot} />
                      )}
                      {lvl && (
                        <DetailRow label="Pain severity" value={cap(sr.painLevel!)} dot={lvl.dot} />
                      )}
                    </div>

                    {/* Section: Symptoms */}
                    {sr.descriptors.length > 0 && (
                      <>
                        <SectionHead>Symptoms</SectionHead>
                        <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:16 }}>
                          {sr.descriptors.map(d => <Tag key={d} label={d} blue />)}
                        </div>
                      </>
                    )}

                    {/* Section: Aggravating factors */}
                    {sr.aggravatingFactors.length > 0 && (
                      <>
                        <SectionHead>What makes it worse</SectionHead>
                        <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:16 }}>
                          {sr.aggravatingFactors.map(f => <Tag key={f} label={f} />)}
                        </div>
                      </>
                    )}

                    {/* Section: How it started */}
                    {sr.starts.length > 0 && (
                      <>
                        <SectionHead>How it started</SectionHead>
                        <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:16 }}>
                          {sr.starts.map(s => <Tag key={s} label={s} />)}
                        </div>
                      </>
                    )}

                    {/* Section: Timeline & impact */}
                    {(sr.duration || sr.pattern || sr.dailyImpact) && (
                      <>
                        <SectionHead>Timeline & Impact</SectionHead>
                        <div style={{ display:'flex', flexDirection:'column', gap:9, marginBottom:16 }}>
                          {sr.duration && (
                            <DetailRow label="Duration" value={sr.duration} />
                          )}
                          {sr.pattern && (
                            <DetailRow label="Trend" value={PATTERN_LABELS[sr.pattern] ?? sr.pattern} />
                          )}
                          {sr.dailyImpact && (
                            <DetailRow label="Daily impact" value={IMPACT_LABELS[sr.dailyImpact] ?? sr.dailyImpact} />
                          )}
                        </div>
                      </>
                    )}

                    {/* Edit / Remove */}
                    <div style={{ display:'flex', gap:8, marginTop:4 }}>
                      <button onClick={() => onEditRegion(sr.region.id)} style={{
                        flex:1, padding:'11px 0', borderRadius:13,
                        border:`1.5px solid ${colors.border}`,
                        backgroundColor:'#FFF', cursor:'pointer',
                        fontFamily: font.heading, fontWeight:700, fontSize:13, color: colors.text,
                      }}>Edit</button>
                      <button onClick={() => onDeleteRegion(sr.region.id)} style={{
                        flex:1, padding:'11px 0', borderRadius:13,
                        border:'1.5px solid #FECACA',
                        backgroundColor:'#FFF5F5', cursor:'pointer',
                        fontFamily: font.heading, fontWeight:700, fontSize:13, color: colors.red,
                      }}>Remove</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Add another */}
          <button onClick={onAddAnother} style={{
            width:'100%', padding:'16px 0', borderRadius: radius.card,
            border:`2px dashed ${colors.primary}`, backgroundColor:'rgba(36,135,245,0.03)',
            cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8,
          }}>
            <span style={{ width:28, height:28, borderRadius:9, backgroundColor: colors.primary, display:'flex', alignItems:'center', justifyContent:'center', color:'#FFF', fontSize:18, flexShrink:0 }}>+</span>
            <span style={{ fontFamily: font.heading, fontWeight:700, fontSize:14, color: colors.primary }}>Add another pain area</span>
          </button>

          <div style={{ height:8 }} />
        </div>
      </div>

      {/* Submit */}
      <div style={{ padding:'10px 20px 32px', borderTop:`1px solid ${colors.border}` }}>
        <button onClick={onSubmit} style={{
          width:'100%', padding:'17px 0', borderRadius: radius.button, border:'none',
          backgroundColor: colors.primary, cursor:'pointer', boxShadow: shadow.button,
          fontFamily: font.heading, fontWeight:700, fontSize:16, color:'#FFF',
        }}>
          Submit Assessment →
        </button>
      </div>
    </div>
  );
}

function SectionHead({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      margin:'0 0 8px', fontFamily: font.body, fontSize:11, fontWeight:700,
      letterSpacing:'0.6px', textTransform:'uppercase', color: colors.textMuted,
    }}>{children}</p>
  );
}

function DetailRow({ label, value, dot }: { label: string; value: string; dot?: string }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:8 }}>
      <span style={{ fontFamily: font.body, fontSize:13, color: colors.textSecondary, flexShrink:0 }}>{label}</span>
      <div style={{ display:'flex', alignItems:'center', gap:6, textAlign:'right' }}>
        {dot && <span style={{ width:8, height:8, borderRadius:'50%', backgroundColor: dot, display:'inline-block', flexShrink:0 }} />}
        <span style={{ fontFamily: font.body, fontWeight:600, fontSize:13, color: colors.text }}>{value}</span>
      </div>
    </div>
  );
}

function Tag({ label, blue }: { label: string; blue?: boolean }) {
  return (
    <span style={{
      padding:'5px 11px', borderRadius:9999, fontSize:12, fontFamily: font.body,
      backgroundColor: blue ? 'rgba(36,135,245,0.08)' : '#F3F4F6',
      border:`1px solid ${blue ? 'rgba(36,135,245,0.25)' : colors.border}`,
      color: blue ? colors.primary : colors.text, fontWeight:500,
    }}>{label}</span>
  );
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const iconBtn: React.CSSProperties = {
  width:40, height:40, borderRadius:13, backgroundColor:'#FFF',
  border:`1px solid ${colors.border}`, display:'flex', alignItems:'center',
  justifyContent:'center', cursor:'pointer', flexShrink:0, boxShadow:'0 1px 4px rgba(0,0,0,0.06)',
};
