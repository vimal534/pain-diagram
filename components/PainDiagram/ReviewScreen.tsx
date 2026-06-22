import React, { useState, useEffect, useRef } from 'react';
import { SelectedRegion } from '../../types/pain';
import { colors, radius, shadow, font, SEVERITY_COLORS } from './tokens';
import StatusBar from './StatusBar';
import { BODY_REGIONS } from './BodyMapScreen';

const IMPACT_LABELS: Record<string, string> = {
  None: 'No impact',
  Some: 'Some impact',
  'A lot': 'Significant impact',
  Unable: 'Unable to perform',
};

const PATTERN_LABELS: Record<string, string> = {
  Improving: 'Getting better over time',
  Stable: 'Staying the same',
  Worsening: 'Getting worse over time',
};

// viewBox [x, y, w, h] cropped to each anatomy group for a focused zoom
const REGION_VIEWBOX: Record<string, string> = {
  head:     '250 60  520 380',
  neck:     '300 200 420 340',
  shoulder: '60  200 900 420',
  upperarm: '60  380 900 400',
  elbow:    '60  560 900 340',
  forearm:  '30  700 960 320',
  wrist:    '30  880 960 280',
  hand:     '30 1020 960 320',
  chest:    '150 340 720 400',
  abdomen:  '180 600 660 380',
  pelvis:   '200 820 620 320',
  hip:      '120 820 780 400',
  thigh:    '150 980 720 360',
  knee:     '180 1180 660 300',
  calf:     '180 1340 660 300',
  ankle:    '180 1480 660 280',
  foot:     '180 1580 660 300',
  back:     '150 340 720 700',
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
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<{ id: string; label: string; region: SelectedRegion } | null>(null);
  const undoRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleDeleteConfirm = (id: string) => {
    const sr = selectedRegions.find(r => r.region.id === id);
    if (!sr) return;
    setConfirmId(null);
    // Collapse animation first
    setCollapsedIds(prev => new Set(prev).add(id));
    setToast({ id, label: sr.region.label, region: sr });
    // After animation, actually delete
    undoRef.current = setTimeout(() => {
      setCollapsedIds(prev => { const s = new Set(prev); s.delete(id); return s; });
      setToast(null);
      const remaining = selectedRegions.filter(r => r.region.id !== id);
      if (remaining.length === 0) {
        onDeleteRegion(id); // triggers back to bodymap via parent
      } else {
        onDeleteRegion(id);
      }
    }, 3500);
    // Toast auto-dismiss
    toastTimerRef.current = setTimeout(() => setToast(null), 3500);
  };

  const handleUndo = () => {
    if (undoRef.current) clearTimeout(undoRef.current);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    if (toast) setCollapsedIds(prev => { const s = new Set(prev); s.delete(toast.id); return s; });
    setToast(null);
  };

  const confirmRegion = confirmId ? selectedRegions.find(r => r.region.id === confirmId) : null;

  return (
    <div style={{ backgroundColor: '#F8FAFC', display: 'flex', flexDirection: 'column', height: '100%', fontFamily: font.heading }}>
      <StatusBar />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '10px 16px 12px', backgroundColor: '#FFFFFF', flexShrink: 0 }}>
        <button onClick={onBack} style={backBtn}>
          <svg width="9" height="16" viewBox="0 0 9 16" fill="none">
            <path d="M8 1L1 8L8 15" stroke={colors.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div style={{ paddingTop: 2 }}>
          <h1 style={{ margin: 0, fontFamily: font.heading, fontWeight: 800, fontSize: 20, color: colors.text, letterSpacing: '-0.3px' }}>Review your pain details</h1>
          <p style={{ margin: '3px 0 0', fontFamily: font.body, fontSize: 13, color: colors.textSecondary }}>
            {selectedRegions.length} pain area{selectedRegions.length !== 1 ? 's' : ''} recorded · Tap to expand
          </p>
        </div>
      </div>

      {/* Cards */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {selectedRegions.map(sr => {
            const lvl = sr.painLevel ? SEVERITY_COLORS[sr.painLevel] : null;
            const isExpanded = expandedId === sr.region.id;
            const isCollapsing = collapsedIds.has(sr.region.id);
            const summaryParts: string[] = [];
            if (sr.exactSpot) summaryParts.push(sr.exactSpot);
            if (sr.descriptors.length) summaryParts.push(sr.descriptors.slice(0, 2).join(', '));
            if (sr.duration) summaryParts.push(sr.duration);

            return (
              <div key={sr.region.id} style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 20,
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)',
                maxHeight: isCollapsing ? 0 : 600,
                opacity: isCollapsing ? 0 : 1,
                marginBottom: isCollapsing ? -12 : 0,
                transform: isCollapsing ? 'scaleY(0.92)' : 'scaleY(1)',
                transformOrigin: 'top',
                transition: 'max-height 0.35s ease, opacity 0.3s ease, margin-bottom 0.35s ease, transform 0.3s ease',
                pointerEvents: isCollapsing ? 'none' : 'auto',
              }}>
                {/* Collapsed header */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : sr.region.id)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '16px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                >
                  <div style={{
                    width: 58, height: 58, borderRadius: 16, flexShrink: 0,
                    backgroundColor: '#FFFFFF',
                    border: `1.5px solid #E5E7EB`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    overflow: 'hidden',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
                  }}>
                    <svg
                      viewBox={REGION_VIEWBOX[sr.region.anatomyGroup] ?? '10 60 1004 1440'}
                      style={{ width: 44, height: 44 }}
                    >
                      {BODY_REGIONS.map(r => {
                        const isActive = r.id === sr.region.id;
                        return (
                          <path key={r.id} d={r.svgPath}
                            fill={isActive ? colors.primary : '#E5E7EB'}
                            stroke="#FFFFFF" strokeWidth={10} strokeLinejoin="round"
                            opacity={isActive ? 1 : 0.7}
                          />
                        );
                      })}
                    </svg>
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5, flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: font.heading, fontWeight: 800, fontSize: 16, color: colors.text }}>{sr.region.label}</span>
                      {lvl && (
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 5,
                          fontFamily: font.body, fontWeight: 600, fontSize: 12,
                          color: lvl.text, backgroundColor: lvl.bg,
                          border: `1px solid ${lvl.border}`, borderRadius: 999, padding: '3px 10px 3px 7px',
                        }}>
                          <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: lvl.dot, display: 'inline-block', flexShrink: 0 }} />
                          {cap(sr.painLevel!)}
                        </span>
                      )}
                    </div>
                    <p style={{ margin: 0, fontFamily: font.body, fontSize: 13, color: colors.textSecondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {summaryParts.length ? summaryParts.join(' · ') : 'Tap to review details'}
                    </p>
                  </div>

                  <div style={{ flexShrink: 0, width: 32, height: 32, borderRadius: '50%', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                      <path d="M1 1.5L6 6.5L11 1.5" stroke={colors.textSecondary} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </button>

                {/* Expanded detail */}
                {isExpanded && (
                  <>
                    <div style={{ height: 1, backgroundColor: '#F3F4F6' }} />
                    <div style={{ padding: '0 16px 16px' }}>
                      {sr.exactSpot && <DetailRow label="Exact location" value={sr.exactSpot} />}
                      {sr.painLevel && lvl && (
                        <DetailRow label="Pain severity">
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: 5,
                            backgroundColor: lvl.bg, border: `1px solid ${lvl.border}`,
                            borderRadius: 999, padding: '3px 10px 3px 8px',
                          }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: lvl.dot, display: 'inline-block' }} />
                            <span style={{ fontFamily: font.body, fontSize: 12, fontWeight: 600, color: lvl.text, textTransform: 'capitalize' }}>{sr.painLevel}</span>
                          </span>
                        </DetailRow>
                      )}
                      {sr.descriptors.length > 0 && (
                        <DetailRow label="Symptoms" value={sr.descriptors.join(', ')} />
                      )}
                      {sr.aggravatingFactors.length > 0 && (
                        <DetailRow label="What makes it worse" value={sr.aggravatingFactors.slice(0, 3).join(', ')} />
                      )}
                      {sr.starts.length > 0 && <DetailRow label="How it started" value={sr.starts[0]} />}
                      {sr.duration && <DetailRow label="Duration" value={sr.duration} />}
                      {sr.dailyImpact && <DetailRow label="Daily impact" value={IMPACT_LABELS[sr.dailyImpact] ?? sr.dailyImpact} isLast />}

                      <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                        <button onClick={() => setConfirmId(sr.region.id)} style={{
                          flex: '0 0 48px', padding: '13px 0', borderRadius: 14,
                          border: '1px solid #FECACA',
                          backgroundColor: '#FFF5F5', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <svg width="13" height="14" viewBox="0 0 13 14" fill="none">
                            <path d="M1 3H12M4.5 3V2H8.5V3M2 3L3 12H10L11 3H2Z" stroke="#EF4444" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        <button onClick={() => onEditRegion(sr.region.id)} style={{
                          flex: 1, padding: '13px 0', borderRadius: 14,
                          border: `1px solid rgba(36,135,245,0.28)`,
                          backgroundColor: 'rgba(36,135,245,0.05)', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                        }}>
                          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                            <path d="M8.5 1.5L11.5 4.5L4.5 11.5H1.5v-3L8.5 1.5z" stroke={colors.primary} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <span style={{ fontFamily: font.heading, fontWeight: 600, fontSize: 14, color: colors.primary }}>Edit details</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}

          {/* Add another */}
          <button onClick={onAddAnother} style={{
            width: '100%', padding: '16px 0', borderRadius: 20,
            border: `2px dashed rgba(36,135,245,0.35)`, backgroundColor: 'rgba(36,135,245,0.03)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <span style={{ fontFamily: font.body, fontSize: 20, color: colors.primary, fontWeight: 300, lineHeight: 1 }}>+</span>
            <span style={{ fontFamily: font.heading, fontWeight: 700, fontSize: 14, color: colors.primary }}>Add another pain area</span>
          </button>

          <div style={{ height: 16 }} />
        </div>
      </div>

      {/* Submit */}
      <div style={{ padding: '10px 16px 32px', backgroundColor: '#FFFFFF', borderTop: '1px solid #F0F1F5' }}>
        <button onClick={onSubmit} style={{
          width: '100%', padding: '17px 0', borderRadius: radius.button, border: 'none',
          backgroundColor: colors.primary, cursor: 'pointer', boxShadow: shadow.button,
          fontFamily: font.heading, fontWeight: 700, fontSize: 16, color: '#FFF',
        }}>
          Submit Assessment →
        </button>
      </div>

      {/* Confirmation modal */}
      {confirmRegion && (
        <>
          <div onClick={() => setConfirmId(null)} style={{
            position: 'absolute', inset: 0, zIndex: 50,
            backgroundColor: 'rgba(0,0,0,0.45)',
            display: 'flex', alignItems: 'flex-end',
          }} />
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 51,
            backgroundColor: '#FFFFFF', borderRadius: '24px 24px 0 0',
            padding: '28px 20px 40px',
            boxShadow: '0 -4px 32px rgba(0,0,0,0.12)',
          }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#FFF1F2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M2 4.5H16M6.5 4.5V3H11.5V4.5M3.5 4.5L4.5 15H13.5L14.5 4.5H3.5Z" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p style={{ margin: '0 0 6px', fontFamily: font.heading, fontWeight: 800, fontSize: 18, color: colors.text, textAlign: 'center' }}>
              Remove {confirmRegion.region.label}?
            </p>
            <p style={{ margin: '0 0 24px', fontFamily: font.body, fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 1.5 }}>
              All details recorded for this area will be deleted.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setConfirmId(null)} style={{
                flex: 1, padding: '14px 0', borderRadius: radius.button,
                border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF', cursor: 'pointer',
                fontFamily: font.heading, fontWeight: 600, fontSize: 15, color: colors.text,
              }}>
                Cancel
              </button>
              <button onClick={() => handleDeleteConfirm(confirmRegion.region.id)} style={{
                flex: 1, padding: '14px 0', borderRadius: radius.button,
                border: 'none', backgroundColor: '#EF4444', cursor: 'pointer',
                fontFamily: font.heading, fontWeight: 700, fontSize: 15, color: '#FFF',
              }}>
                Remove
              </button>
            </div>
          </div>
        </>
      )}

      {/* Undo toast */}
      {toast && (
        <div style={{
          position: 'absolute', bottom: 100, left: 16, right: 16, zIndex: 60,
          backgroundColor: '#1F2937', borderRadius: 14,
          padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          animation: 'slideUp 0.3s ease',
        }}>
          <span style={{ fontFamily: font.body, fontSize: 14, color: '#FFFFFF' }}>
            <strong>{toast.label}</strong> removed
          </span>
          <button onClick={handleUndo} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: font.heading, fontWeight: 700, fontSize: 14, color: colors.primary,
            padding: '4px 8px', borderRadius: 8, backgroundColor: 'rgba(36,135,245,0.15)',
          }}>
            Undo
          </button>
        </div>
      )}
    </div>
  );
}

interface DetailRowProps {
  label: string;
  value?: string;
  isLast?: boolean;
  children?: React.ReactNode;
}

function DetailRow({ label, value, isLast, children }: DetailRowProps) {
  return (
    <div style={{
      display: 'flex', alignItems: children ? 'flex-start' : 'center',
      justifyContent: 'space-between', gap: 12,
      padding: '11px 0',
      borderBottom: isLast ? 'none' : '1px solid #F3F4F6',
    }}>
      <span style={{ fontFamily: font.body, fontSize: 13, color: colors.textSecondary, flexShrink: 0 }}>{label}</span>
      {children ?? (
        <span style={{ fontFamily: font.body, fontWeight: 600, fontSize: 13, color: colors.text, textAlign: 'right' }}>{value}</span>
      )}
    </div>
  );
}


const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const backBtn: React.CSSProperties = {
  width: 32, height: 32, backgroundColor: 'transparent',
  border: 'none', display: 'flex', alignItems: 'center',
  justifyContent: 'center', cursor: 'pointer', flexShrink: 0, padding: 0,
};
