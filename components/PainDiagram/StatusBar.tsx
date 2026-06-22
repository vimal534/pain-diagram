import React from 'react';
import { colors, font } from './tokens';

export default function StatusBar() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '16px 28px 4px', flexShrink: 0, height: 54, backgroundColor: '#FFFFFF',
    }}>
      <span style={{ fontFamily: font.body, fontWeight: 600, fontSize: 15, color: colors.text }}>9:41</span>
      {/* Centre gap — Dynamic Island sits here in the physical frame */}
      <div style={{ width: 130 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {/* Signal */}
        <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
          <rect x="0"    y="8"   width="3" height="4"   rx="1" fill={colors.text} />
          <rect x="4.5"  y="5.5" width="3" height="6.5" rx="1" fill={colors.text} />
          <rect x="9"    y="3"   width="3" height="9"   rx="1" fill={colors.text} />
          <rect x="13.5" y="0"   width="3" height="12"  rx="1" fill={colors.text} opacity="0.25" />
        </svg>
        {/* WiFi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <circle cx="8" cy="11" r="1.2" fill={colors.text} />
          <path d="M5 8C6.1 6.9 6.95 6.4 8 6.4s1.9.5 3 1.6" stroke={colors.text} strokeWidth="1.4" strokeLinecap="round" fill="none" />
          <path d="M2.5 5.5C4.2 3.7 6 2.7 8 2.7s3.8.9 5.5 2.8" stroke={colors.text} strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.45" />
        </svg>
        {/* Battery */}
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          <rect x="0.6" y="0.6" width="20.8" height="10.8" rx="2.8" stroke={colors.text} strokeWidth="1.2" />
          <rect x="2.2" y="2.2" width="15"   height="7.6"  rx="1.5" fill={colors.text} />
          <path d="M22.5 4v4" stroke={colors.text} strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}
