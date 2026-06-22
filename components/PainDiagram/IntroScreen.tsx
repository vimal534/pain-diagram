import React from 'react';
import { colors, radius, font } from './tokens';
import StatusBar from './StatusBar';
import healthproLogo from '../../src/assets/Healthpro-logo.png';

const FEATURES = [
  { title: 'Created and validated by doctors', desc: 'Built with medical expertise you can trust.' },
  { title: 'Clinically validated with real patients', desc: 'Trained and tested on thousands of cases.' },
  { title: 'Trusted by thousands of patients', desc: 'Helping people understand their pain every day.' },
];

interface Props {
  onStart: () => void;
}

export default function IntroScreen({ onStart }: Props) {
  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      display: 'flex', flexDirection: 'column', height: '100%',
      fontFamily: font.heading, overflow: 'hidden',
    }}>
      <StatusBar />

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px' }}>

        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 32, marginBottom: 36 }}>
          <img src={healthproLogo} alt="Healthpro Clinic" style={{ height: 34, objectFit: 'contain' }} />
        </div>

        {/* Headline */}
        <h1 style={{
          margin: '0 0 12px',
          fontFamily: font.heading, fontWeight: 800, fontSize: 30,
          lineHeight: 1.2, color: colors.text, letterSpacing: '-0.6px',
          textAlign: 'center',
        }}>
          Check your signs &amp; symptoms
        </h1>

        {/* Subtitle */}
        <p style={{
          margin: '0 0 40px',
          fontFamily: font.body, fontSize: 14, lineHeight: 1.65,
          color: colors.textSecondary, textAlign: 'center',
        }}>
          Take a short pain assessment to help your care team prepare for your visit.
        </p>

        {/* Feature list */}
        <div style={{ marginBottom: 32 }}>
          <p style={{ margin: '0 0 16px', fontFamily: font.body, fontSize: 11, fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', color: colors.textMuted }}>
            About this checker
          </p>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {FEATURES.map((f, i) => (
              <div key={f.title} style={{
                display: 'flex', alignItems: 'flex-start', gap: 14,
                paddingTop: i > 0 ? 16 : 0,
                marginTop: i > 0 ? 16 : 0,
                borderTop: i > 0 ? '1px solid #F3F4F6' : 'none',
              }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                  backgroundColor: 'rgba(36,135,245,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke={colors.primary} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 2px', fontFamily: font.heading, fontWeight: 700, fontSize: 14, color: colors.text, lineHeight: 1.3 }}>
                    {f.title}
                  </p>
                  <p style={{ margin: 0, fontFamily: font.body, fontSize: 13, lineHeight: 1.55, color: colors.textSecondary }}>
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy note */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '14px 16px', borderRadius: 14,
          backgroundColor: '#F8FAFC', border: '1px solid #E9ECF0',
          marginBottom: 24,
        }}>
          <svg width="15" height="17" viewBox="0 0 15 17" fill="none" style={{ flexShrink: 0 }}>
            <path d="M7.5 1L1 4V8.5C1 12 4 15.2 7.5 16C11 15.2 14 12 14 8.5V4L7.5 1Z" stroke={colors.textMuted} strokeWidth="1.3" fill="none"/>
            <path d="M4.5 8.5L6.5 10.5L10.5 6.5" stroke={colors.textMuted} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p style={{ margin: 0, fontFamily: font.body, fontSize: 12, color: colors.textSecondary, lineHeight: 1.5 }}>
            Your data is <span style={{ fontWeight: 600, color: colors.text }}>private and secure.</span> We never share your personal health information.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: '12px 24px 36px', backgroundColor: '#FFFFFF' }}>
        <button onClick={onStart} style={{
          width: '100%', padding: '17px 0', borderRadius: radius.button,
          border: 'none', backgroundColor: colors.primary,
          cursor: 'pointer', boxShadow: '0 4px 16px rgba(36,135,245,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <span style={{ fontFamily: font.heading, fontWeight: 700, fontSize: 16, color: '#FFFFFF' }}>
            Next →
          </span>
        </button>
      </div>
    </div>
  );
}
