import React, { useEffect, useState } from 'react';
import { SelectedRegion } from '../../types/pain';
import { colors, radius, shadow, font, SEVERITY_COLORS } from './tokens';
import StatusBar from './StatusBar';

interface Props {
  selectedRegions: SelectedRegion[];
  onDone: () => void;
}

export default function ThankYouScreen({ selectedRegions, onDone }: Props) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 60); return () => clearTimeout(t); }, []);

  return (
    <div style={{ backgroundColor: '#F8FAFC', display: 'flex', flexDirection: 'column', height: '100%', fontFamily: font.heading }}>
      <StatusBar />

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 16px' }}>

        {/* Hero */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '32px 24px 28px', textAlign: 'center',
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.4s ease, transform 0.4s ease',
        }}>
          {/* Success ring + checkmark */}
          <div style={{ position: 'relative', marginBottom: 24 }}>
            <div style={{
              width: 88, height: 88, borderRadius: '50%',
              backgroundColor: colors.greenBg,
              border: `2.5px solid ${colors.green}`,
              boxShadow: `0 0 0 10px rgba(16,185,129,0.08), 0 0 0 20px rgba(16,185,129,0.04)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="36" height="28" viewBox="0 0 36 28" fill="none">
                <path
                  d="M3 14L13 24L33 4"
                  stroke={colors.green} strokeWidth="3.5"
                  strokeLinecap="round" strokeLinejoin="round"
                  strokeDasharray="48"
                  strokeDashoffset={visible ? 0 : 48}
                  style={{ transition: 'stroke-dashoffset 0.5s ease 0.2s' }}
                />
              </svg>
            </div>
          </div>

          <h1 style={{ margin: 0, fontFamily: font.heading, fontWeight: 900, fontSize: 26, color: colors.text, letterSpacing: '-0.5px', lineHeight: 1.2 }}>
            Thank you!
          </h1>
          <p style={{ margin: '10px 0 0', fontFamily: font.body, fontSize: 14, color: colors.textSecondary, lineHeight: 1.65, maxWidth: 280 }}>
            Your pain assessment has been submitted. Your care team will review this before your appointment.
          </p>
        </div>


        {/* What happens next */}
        <div style={{
          backgroundColor: '#FFFFFF', borderRadius: 20,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.05)',
          overflow: 'hidden',
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.4s ease 0.2s, transform 0.4s ease 0.2s',
        }}>
          <div style={{ padding: '14px 16px 10px', borderBottom: '1px solid #F0F1F5' }}>
            <p style={{ margin: 0, fontFamily: font.body, fontSize: 11, fontWeight: 700, letterSpacing: '0.7px', textTransform: 'uppercase', color: colors.textMuted }}>
              What happens next
            </p>
          </div>
          <div style={{ padding: '8px 16px 16px' }}>
            {NEXT_STEPS.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, padding: '12px 0', borderBottom: i < NEXT_STEPS.length - 1 ? '1px solid #F0F1F5' : 'none' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 11, flexShrink: 0,
                  backgroundColor: step.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {step.icon}
                </div>
                <div style={{ paddingTop: 2 }}>
                  <p style={{ margin: '0 0 3px', fontFamily: font.heading, fontWeight: 700, fontSize: 13, color: colors.text }}>{step.title}</p>
                  <p style={{ margin: 0, fontFamily: font.body, fontSize: 12, color: colors.textSecondary, lineHeight: 1.55 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Done button */}
      <div style={{
        padding: '10px 16px 32px', backgroundColor: '#FFFFFF', borderTop: '1px solid #F0F1F5',
        opacity: visible ? 1 : 0, transition: 'opacity 0.4s ease 0.3s',
      }}>
        <button onClick={onDone} style={{
          width: '100%', padding: '17px 0', borderRadius: radius.button, border: 'none',
          backgroundColor: colors.primary, cursor: 'pointer', boxShadow: shadow.button,
          fontFamily: font.heading, fontWeight: 700, fontSize: 16, color: '#FFF',
        }}>
          Done
        </button>
      </div>
    </div>
  );
}

const NEXT_STEPS = [
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 1L10 6H15L11 9.5L12.5 15L8 12L3.5 15L5 9.5L1 6H6L8 1Z" stroke="#2487F5" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    ),
    bg: '#EFF6FF',
    title: 'Provider review',
    desc: 'Your orthopedic specialist will review your pain details before your appointment.',
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="3" width="14" height="11" rx="2.5" stroke="#7C3AED" strokeWidth="1.4" />
        <path d="M5 1V4M11 1V4" stroke="#7C3AED" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M1 7H15" stroke="#7C3AED" strokeWidth="1.4" />
      </svg>
    ),
    bg: '#F5F3FF',
    title: 'Appointment prep',
    desc: 'Your provider may follow up with additional questions to better prepare.',
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 1C4.13 1 1 4.13 1 8s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7z" stroke="#059669" strokeWidth="1.4" fill="none" />
        <path d="M5 8L7 10L11 6" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    bg: '#ECFDF5',
    title: 'Personalised care',
    desc: 'Receive tailored recommendations and a care plan built around your pain profile.',
  },
];
