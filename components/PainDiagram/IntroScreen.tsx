import React from 'react';
import { colors, radius, shadow, font } from './tokens';

const YOSI_LOGO = 'https://www.figma.com/api/mcp/asset/82ce2c55-cf96-487b-ad3b-78d0c4cdecef';

const features = [
  {
    icon: '🔍',
    title: 'Possible causes',
    desc: 'Understand what may be behind your pain',
  },
  {
    icon: '💡',
    title: 'Recommendations',
    desc: 'Get personalised next steps for your care',
  },
  {
    icon: '✅',
    title: 'Validated by doctors',
    desc: 'Assessment built with clinical experts',
  },
];

interface Props {
  onStart: () => void;
}

export default function IntroScreen({ onStart }: Props) {
  return (
    <div
      style={{
        backgroundColor: colors.bg,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        fontFamily: font.heading,
        overflow: 'hidden',
      }}
    >
      {/* Status bar */}
      <StatusBar />

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px 0' }}>
        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: radius.card,
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(11,165,180,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: shadow.card,
            }}
          >
            <img src={YOSI_LOGO} alt="Yosi" style={{ width: 38, height: 28, objectFit: 'contain' }} />
          </div>
        </div>

        {/* Headline */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1
            style={{
              margin: '0 0 12px',
              fontFamily: font.heading,
              fontWeight: 800,
              fontSize: 30,
              lineHeight: '38px',
              color: colors.text,
              letterSpacing: '-0.5px',
            }}
          >
            Check your signs &{'\n'}symptoms
          </h1>
          <p
            style={{
              margin: 0,
              fontFamily: font.body,
              fontWeight: 400,
              fontSize: 15,
              lineHeight: '24px',
              color: colors.textSecondary,
            }}
          >
            Tell us where it hurts and we'll help you understand what's going on.
          </p>
        </div>

        {/* Feature cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
          {features.map((f) => (
            <div
              key={f.title}
              style={{
                backgroundColor: colors.cardBg,
                borderRadius: radius.card,
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                boxShadow: shadow.card,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  backgroundColor: colors.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  flexShrink: 0,
                }}
              >
                {f.icon}
              </div>
              <div>
                <p
                  style={{
                    margin: '0 0 2px',
                    fontFamily: font.heading,
                    fontWeight: 700,
                    fontSize: 15,
                    color: colors.text,
                  }}
                >
                  {f.title}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontFamily: font.body,
                    fontSize: 13,
                    lineHeight: '18px',
                    color: colors.textSecondary,
                  }}
                >
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Privacy card */}
        <div
          style={{
            backgroundColor: 'rgba(36,135,245,0.06)',
            borderRadius: radius.card,
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 28,
            border: `1px solid rgba(36,135,245,0.12)`,
          }}
        >
          <span style={{ fontSize: 20, flexShrink: 0 }}>🔒</span>
          <p
            style={{
              margin: 0,
              fontFamily: font.body,
              fontSize: 13,
              lineHeight: '18px',
              color: colors.primary,
              fontWeight: 500,
            }}
          >
            Your information is private and secure. We never share your health data.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: '16px 20px 32px', backgroundColor: colors.bg }}>
        <button
          onClick={onStart}
          style={{
            width: '100%',
            padding: '18px 0',
            borderRadius: radius.button,
            border: 'none',
            backgroundColor: colors.primary,
            cursor: 'pointer',
            boxShadow: shadow.button,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <span
            style={{
              fontFamily: font.heading,
              fontWeight: 700,
              fontSize: 16,
              color: '#FFFFFF',
            }}
          >
            Start Assessment
          </span>
          <span style={{ color: '#FFFFFF', fontSize: 18 }}>→</span>
        </button>
      </div>
    </div>
  );
}

function StatusBar() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 24px 8px',
        flexShrink: 0,
      }}
    >
      <span style={{ fontFamily: font.body, fontWeight: 600, fontSize: 15, color: colors.text }}>
        9:41
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 12 }}>▐▐▐</span>
        <span style={{ fontSize: 12 }}>WiFi</span>
        <span style={{ fontSize: 12 }}>🔋</span>
      </div>
    </div>
  );
}
