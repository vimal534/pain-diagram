import React from 'react';
import { SelectedRegion } from '../../types/pain';
import { colors, radius, shadow, font, SEVERITY_COLORS } from './tokens';
import StatusBar from './StatusBar';

const IMPACT_LABELS: Record<string, string> = {
  None: 'No daily impact',
  Some: 'Some impact on daily activities',
  'A lot': 'Significantly limits daily life',
  Unable: 'Unable to perform normal activities',
};

const PATTERN_LABELS: Record<string, string> = {
  Improving: 'Getting better',
  Stable:    'Staying the same',
  Worsening: 'Getting worse',
};

interface Props {
  selectedRegions: SelectedRegion[];
  onDone: () => void;
}

export default function ThankYouScreen({ selectedRegions, onDone }: Props) {
  return (
    <div style={{ backgroundColor:'#FFFFFF', display:'flex', flexDirection:'column', height:'100%', fontFamily: font.heading }}>
      <StatusBar />

      {/* Hero */}
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'20px 32px 16px', textAlign:'center' }}>
        <div style={{
          width:76, height:76, borderRadius:26, backgroundColor: colors.greenBg,
          border:`2px solid ${colors.green}`, display:'flex', alignItems:'center',
          justifyContent:'center', fontSize:34, marginBottom:16,
          boxShadow:'0 0 0 8px rgba(16,185,129,0.08)',
          color: colors.green,
        }}>
          ✓
        </div>
        <h1 style={{ margin:0, fontWeight:900, fontSize:24, color: colors.text, letterSpacing:'-0.4px' }}>
          Assessment Complete
        </h1>
        <p style={{ margin:'8px 0 0', fontFamily: font.body, fontSize:14, color: colors.textSecondary, lineHeight:1.6, maxWidth:290 }}>
          Your pain information has been recorded successfully. Your orthopedic provider will review this before your appointment.
        </p>
      </div>

      {/* Summary cards */}
      <div style={{ flex:1, overflowY:'auto', padding:'4px 20px' }}>
        <p style={{ margin:'0 0 10px', fontFamily: font.body, fontSize:11, fontWeight:700, letterSpacing:'0.6px', textTransform:'uppercase', color: colors.textMuted }}>
          Pain areas recorded · {selectedRegions.length}
        </p>

        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {selectedRegions.map(sr => {
            const lvl = sr.painLevel ? SEVERITY_COLORS[sr.painLevel] : null;

            return (
              <div key={sr.region.id} style={{
                backgroundColor:'#FFFFFF', borderRadius:20,
                border:`1px solid ${colors.border}`,
                boxShadow:'0 1px 8px rgba(0,0,0,0.05)',
                padding:'14px 16px',
              }}>
                {/* Region title row */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    {lvl && <div style={{ width:10, height:10, borderRadius:'50%', backgroundColor: lvl.dot, flexShrink:0 }} />}
                    <span style={{ fontFamily: font.heading, fontWeight:800, fontSize:15, color: colors.text }}>{sr.region.label}</span>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    {lvl && (
                      <span style={{
                        fontFamily: font.body, fontSize:11, fontWeight:700,
                        color: lvl.text, backgroundColor: lvl.bg,
                        border:`1px solid ${lvl.border}`, borderRadius:6, padding:'2px 8px',
                        textTransform:'capitalize',
                      }}>
                        {sr.painLevel} pain
                      </span>
                    )}
                    <div style={{ width:22, height:22, borderRadius:'50%', backgroundColor: colors.greenBg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, color: colors.green, border:`1px solid ${colors.green}` }}>✓</div>
                  </div>
                </div>

                {/* Detail grid */}
                <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                  {sr.exactSpot && <SummaryLine icon="📍" label="Location" value={sr.exactSpot} />}
                  {sr.duration && <SummaryLine icon="⏱" label="Duration" value={sr.duration} />}
                  {sr.pattern && <SummaryLine icon="📈" label="Trend" value={PATTERN_LABELS[sr.pattern] ?? sr.pattern} />}
                  {sr.dailyImpact && <SummaryLine icon="🏃" label="Daily impact" value={IMPACT_LABELS[sr.dailyImpact] ?? sr.dailyImpact} />}
                  {sr.descriptors.length > 0 && (
                    <SummaryLine icon="💬" label="Symptoms" value={sr.descriptors.join(', ')} />
                  )}
                  {sr.aggravatingFactors.length > 0 && (
                    <SummaryLine icon="⚡" label="Aggravated by" value={sr.aggravatingFactors.slice(0, 3).join(', ') + (sr.aggravatingFactors.length > 3 ? ` +${sr.aggravatingFactors.length - 3} more` : '')} />
                  )}
                  {sr.starts.length > 0 && (
                    <SummaryLine icon="🕐" label="How it started" value={sr.starts.join(', ')} />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Provider note */}
        <div style={{
          marginTop:14, display:'flex', alignItems:'flex-start', gap:12,
          backgroundColor:'rgba(36,135,245,0.05)', border:`1px solid rgba(36,135,245,0.15)`,
          borderRadius:16, padding:'14px 16px',
        }}>
          <span style={{ fontSize:22, flexShrink:0, marginTop:1 }}>🏥</span>
          <div>
            <p style={{ margin:'0 0 3px', fontFamily: font.heading, fontWeight:700, fontSize:13, color: colors.text }}>What happens next?</p>
            <p style={{ margin:0, fontFamily: font.body, fontSize:13, color: colors.textSecondary, lineHeight:1.55 }}>
              Your orthopedic specialist will review these pain details before your appointment and may follow up with additional questions.
            </p>
          </div>
        </div>

        <div style={{ height:16 }} />
      </div>

      {/* Done */}
      <div style={{ padding:'10px 20px 36px', borderTop:`1px solid ${colors.border}` }}>
        <button onClick={onDone} style={{
          width:'100%', padding:'17px 0', borderRadius: radius.button, border:'none',
          background:`linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
          cursor:'pointer', boxShadow: shadow.button,
          fontFamily: font.heading, fontWeight:700, fontSize:16, color:'#FFF',
        }}>
          Done
        </button>
      </div>
    </div>
  );
}

function SummaryLine({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div style={{ display:'flex', alignItems:'flex-start', gap:8 }}>
      <span style={{ fontSize:13, flexShrink:0, marginTop:1 }}>{icon}</span>
      <span style={{ fontFamily: font.body, fontSize:12, color: colors.textSecondary, flexShrink:0, minWidth:90 }}>{label}:</span>
      <span style={{ fontFamily: font.body, fontSize:12, fontWeight:600, color: colors.text, flex:1 }}>{value}</span>
    </div>
  );
}
