import React, { useState } from 'react';
import { BodyRegion, SelectedRegion } from '../../types/pain';
import { font, SEVERITY_COLORS } from './tokens';
import StatusBar from './StatusBar';

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  bodyFill: '#D1D5DB',   // unselected
  hover:    '#8CC4FF',   // hover
  selected: '#2F80ED',   // selected
  stroke:   '#FFFFFF',
  strokeW:  3,
  bg:       '#FFFFFF',
  text:     '#111827',
  sub:      '#6B7280',
  primary:  '#2F80ED',
  border:   '#E5E7EB',
  chipDot:    (s?: string | null) => s ? SEVERITY_COLORS[s]?.dot    ?? '#2F80ED' : '#2F80ED',
  chipBg:     (s?: string | null) => s ? SEVERITY_COLORS[s]?.bg     ?? '#EFF6FF' : '#EFF6FF',
  chipBorder: (s?: string | null) => s ? SEVERITY_COLORS[s]?.border ?? '#2F80ED' : '#2F80ED',
};

// ─── SVG viewBox 0 0 1023 1537 ───────────────────────────────────────────────
// Paths extracted from body pain.svg (Adobe Illustrator).
// Anatomical convention: viewer's LEFT = left on screen, viewer's RIGHT = right.
export const BODY_REGIONS: BodyRegion[] = [
  // HEAD (main oval + right ear + left ear as compound path)
  {
    id: 'head', label: 'Head', side: 'center', anatomyGroup: 'head',
    tooltipX: 510, tooltipY: 48,
    svgPath: 'M 502.8,73.3 c 37.9-4.3,65.8,18.4,69.3,56.2,2.2,23.6-5.1,68.3-15.3,89.7-22,46-76.2,41.3-94.7-4.7-18.9-46.9-28.1-133.5,40.8-141.2Z M 580.7,163.3 c 6.8,6.1-2.1,28.8-6.9,35.1s-4.1,5-7.8,4.7l7.2-38.3 c.9-3.2,5.3-3.5,7.5-1.5Z M 455,203 c -6.1,.7-8.4-4.1-10.7-8.8s-11.9-29-1.6-32 c7.3-2.2,4.7,4.9,5.4,9.2,1.7,10.6,4.3,21.2,6.9,31.6Z',
  },
  // NECK
  {
    id: 'neck', label: 'Neck', side: 'center', anatomyGroup: 'neck',
    tooltipX: 511, tooltipY: 248,
    svgPath: 'M 555,262.5 c 1.6,16.4,14.9,27.2,28.3,34.7,4.4,2.5,14.1,5.6,17.1,7.9,4.2,3.3-3.9,14.8-6.6,18.2-7.7,10-14.3,12.4-26.1,15.9-34.9,10.5-67.3,11-102.8,3.2-10.3-2.3-26.9-5.5-34-13-6.3-6.6-9.4-14.8-13-23,17.2-8.9,44.4-20,46.9-42.1s.4-22.8,1.1-33.4 c17.3,21.1,42.6,32.6,68.3,17.8s14.3-11.9,20.7-18.8 c.7,10.5-1,22.2,0,32.5Z',
  },
  // CHEST (upper torso)
  {
    id: 'chest', label: 'Chest', side: 'center', anatomyGroup: 'chest',
    tooltipX: 511, tooltipY: 458,
    svgPath: 'M 623.8,532.8 c -4.1,1.6-8.1,3.8-12.3,5.2-37.2,12.1-75.7,.4-114.1,1.9-18,.7-36,4.7-54,4.1-16,-.6-33.9-4.1-48-12-1.5-22.6-12.9-46.9-11.5-69.5s20.5-50.1,33.2-73.8 c8.3-15.6,15.3-31.7,21-48.5,12.6,2,24.9,6.4,37.7,8.5,30.7,5.2,53.9,3.4,84-3.4,5.1-1.1,20.4-7.7,23.7-3.3s4.4,15,5.7,18.3 c12.6,32.4,45.2,70.6,46.8,103.2,1.1,21.9-11.3,47.2-12.1,69.3Z',
  },
  // ABDOMEN
  {
    id: 'abdomen', label: 'Abdomen', side: 'center', anatomyGroup: 'abdomen',
    tooltipX: 511, tooltipY: 547,
    svgPath: 'M 622,538 c .2,15.7-5.1,30.9-6,46.5-1.6,27.6,5.2,55.2,7.9,82.4-48.6,18.4-100.3,26.8-152.3,19.9s-52.2-11.6-77.6-19.9 c3.6-29.3,8.7-57.7,7-87.5-.3-5.7-5.9-39.5-4-41.5,15,5.4,30.4,9.4,46.4,10,18.3,.7,36.7-3.4,55-4.1,41.7-1.5,83.8,12.3,123.5-5.9Z',
  },
  // PELVIS / HIP
  {
    id: 'pelvis', label: 'Pelvis', side: 'center', anatomyGroup: 'pelvis',
    tooltipX: 511, tooltipY: 658,
    svgPath: 'M 625,671 c 6.4,30.1,14.1,60.2,16.5,91.1-2.7,7.2-51.7,29-61.5,34.4-4.4,2.4-9,5.1-13.3,7.7-12.7,7.8-35.1,28.2-46.5,32.5s-15.5,2.9-21.1,.7 c-20.9-15-41.3-30.7-64-43-15.1-8.2-33.4-14.5-47.7-23.3-2.6-1.6-10.3-7.2-11.1-9.9-1.5-4.9,2.9-25.1,4.1-31.5,3.5-19.4,8.3-38.6,12.8-57.7,2.3,-.5,4.6,-.1,6.9,.3,10.3,2.1,23.4,8.4,34.7,11.3,52.6,13.1,104.2,12.5,156.4-2,11.4-3.2,22.3-7.7,33.8-10.7Z',
  },
  // RIGHT SHOULDER (viewer's right)
  {
    id: 'r-shoulder', label: 'Right Shoulder', side: 'right', anatomyGroup: 'shoulder',
    tooltipX: 660, tooltipY: 295,
    svgPath: 'M 609.7,307.2 c 30.3,3.8,63.9,1.8,85.2,27.4,22.5,26.9,23.9,69.4,22,103s-.3,7.4-1.5,7.4 c-18.8-7.7-43.1,-.8-59,11s-8.4,8.3-12.5,11.5-1.2,2.3-2.5,.5-2.9-15.8-4-20 c-7.4-29.3-33.5-60.2-45.3-90.7-1.6-4.3-7.3-17.8-5.7-21.2s7.8-7.4,9.9-10.1 c3.9-5,7.9-17.7,13.3-18.8Z',
  },
  // LEFT SHOULDER (viewer's left)
  {
    id: 'l-shoulder', label: 'Left Shoulder', side: 'left', anatomyGroup: 'shoulder',
    tooltipX: 362, tooltipY: 295,
    svgPath: 'M 380,470 c -.9,1-11-8.8-12.5-10-18.7-13.9-41.7-18.2-64.5-13-1.5-28.7-2.7-57.9,8.5-85,16.3-39.5,40.1-45.1,78.9-50.1,4.7,-.6,19-4.3,22.1-3.9s7.9,13.7,11.1,17.9,11.6,10,11.3,13.3 c-6.3,17.4-13.9,34.2-22.7,50.4-13.7,25.5-34,49.3-32.2,80.3Z',
  },
  // RIGHT UPPER ARM
  {
    id: 'r-upperarm', label: 'Right Upper Arm', side: 'right', anatomyGroup: 'upperarm',
    tooltipX: 703, tooltipY: 465,
    svgPath: 'M 688.8,446.3 c 5.7,-.7,26.6-1.5,29,4.5,9.4,40.3,14.5,81.6,25,121.7-1.6,8.2-51.6,29.2-61.8,24.2-12.6-40.3-28.8-79.7-38.6-121.1,9.9-14.1,29.1-27.1,46.4-29.2Z',
  },
  // LEFT UPPER ARM
  {
    id: 'l-upperarm', label: 'Left Upper Arm', side: 'left', anatomyGroup: 'upperarm',
    tooltipX: 320, tooltipY: 465,
    svgPath: 'M 341.8,595.8 c -2.9,4.1-26.3-2.3-31.1-4-5.4-1.9-30.6-14.5-31.5-19.4,9.3-35.9,10.9-74.5,20.4-110.2s.5-9.9,8.1-11.9 c23.6-6.2,56,5.4,70,25.4l-36,120.1Z',
  },
  // RIGHT FOREARM
  {
    id: 'r-forearm', label: 'Right Forearm', side: 'right', anatomyGroup: 'forearm',
    tooltipX: 733, tooltipY: 665,
    svgPath: 'M 748,778 c -17.9-60.8-61.8-112-66-177,22.2,-.4,44.4-10.2,61.5-24,29.5,56.5,23,124,47.4,182.5l-42.9,18.5Z',
  },
  // LEFT FOREARM
  {
    id: 'l-forearm', label: 'Left Forearm', side: 'left', anatomyGroup: 'forearm',
    tooltipX: 289, tooltipY: 665,
    svgPath: 'M 340,601 c -.6,65.5-44.9,117.3-65,177l-42-17.5-.8-2.7 c18.5-47.9,16.5-102.2,32.8-150.3s8.7-20.1,12-30.5l14.7,9.8 c14.8,8.3,31,14.5,48.3,14.2Z',
  },
  // RIGHT HAND
  {
    id: 'r-hand', label: 'Right Hand', side: 'right', anatomyGroup: 'hand',
    tooltipX: 800, tooltipY: 810,
    svgPath: 'M 817,820 l 15.9,66.4 c -.6,6.9-6.2,8.8-11.4,4.5l-14.5-40.9 c.1,11.2,14.3,45.9,8.9,54.4s-10.6,1.8-12.4-3.4l-11.5-48 c-1.7,-.3-1,2.3,-.9,3.4,1.2,8.2,10.9,39.5,8.4,44.6s-10.5,1.2-12.7-3.3 c-6.3-12.9-5.8-34.3-12.3-47.7-.7,6.3,2.1,12.6,3.2,18.8s2.6,12.8,2.2,15.4 c-1,6.1-9.3,6.6-11.6,1-2.7-21.4-10.8-41.5-15.9-62.1-3.5-14-4.8-26.1-3.3-40.5,13.4-8.1,28.7-11.8,42.8-18.5l2.2,.3 c8.4,10.3,23.3,18.6,31,29,4.5,6,7.2,15.9,11.2,22.8,2.2,3.8,13.3,17,13.6,18.4,.5,2.1-1.1,4.6-3.1,5.5-12.3,5.7-22.4-13.6-29.8-20.3Z',
  },
  // LEFT HAND
  {
    id: 'l-hand', label: 'Left Hand', side: 'left', anatomyGroup: 'hand',
    tooltipX: 213, tooltipY: 810,
    svgPath: 'M 248,850 c -2.7,-.5-1.7,.5-2.3,2.2-3.4,10.8-7.2,38.9-12.9,46.2s-11.6,6-11.9,-.8l9.8-42.3-.7-3.2-12.2,48.3 c-1.3,5.5-10.1,9.9-13.1,3.5-4.6-9.9,10.1-44.5,10.3-56.8l-14.2,41.3 c-3.4,5.9-11,7.3-11.8,-.8s8.7-41.5,11.5-52.5,4.5-8.7,3.5-14 c-2,-.5-1.9,.8-2.8,1.7-6.7,6.5-14.5,20.6-26.5,17.1-8.4-2.5,-.9-8.5,1.3-11.3,9.5-12.3,14.6-24.4,22-38l30.7-26.4h2.5 c13.9,6.8,29.6,9.6,42.2,18.8,.6,9.6,.7,18.7,-.7,28.3s-7.9,25.6-11.4,38.6-6,33.2-9.3,36.7-9.2,3.5-10-1 c-1.7-9.2,4.7-25.9,6-35.5Z',
  },
  // RIGHT THIGH
  {
    id: 'r-thigh', label: 'Right Thigh', side: 'right', anatomyGroup: 'thigh',
    tooltipX: 604, tooltipY: 865,
    svgPath: 'M 643,767 l 7,68.5 c 5.4,53.8-11.1,104.2-19.7,156.3-1.9,11.3-2.3,22.9-4.3,34.2-24.4-15.7-59.1-12.9-81.5,5l-1.4-2.5 c-6.4-55-25.1-111.6-27-167-.3-8.5,1-16.4,7.5-22.5s29.3-21.4,39.2-27.8 c21.5-14,45.2-24.3,68-36l12.3-8.2Z',
  },
  // LEFT THIGH
  {
    id: 'l-thigh', label: 'Left Thigh', side: 'left', anatomyGroup: 'thigh',
    tooltipX: 424, tooltipY: 865,
    svgPath: 'M 377,767 c .1,.1,.2,1.8,1.6,2.9,14,10.8,37.2,18.9,53.4,27.6,23.2,12.5,44.4,27.9,65.5,43.5,3.2,5.2,3.7,11.5,3.5,17.6-.3,10.6-1.9,24.2-3.2,34.8-5.6,46-19.8,90.6-24.9,136.6-6.5-2.8-12.1-7.2-18.7-9.8-19.2-7.4-46.1-6.4-63.3,5.8-3-44.2-17.2-86.6-22-130.5-4.7-43.2,-.8-85.3,6-127.9-.2,-.9,1.8,-.6,2,-.5Z',
  },
  // RIGHT CALF / LOWER LEG
  {
    id: 'r-calf', label: 'Right Calf', side: 'right', anatomyGroup: 'calf',
    tooltipX: 582, tooltipY: 1145,
    svgPath: 'M 625.8,1030.2 c 1.1,12.8,-.8,26.6,.2,39.3s6.5,30.1,8,45 c6.3,62.6-22.4,122.3-17.9,184.9-.1,.6-5.4,1.5-6.6,1.6-8.2,.7-24.9,1.1-32.7,-.2-6.8-1.1-3.4-5.9-3.8-12.2-1.5-26-3.9-51.9-9.7-77.3s-13.8-43.2-15.3-64.7,2.2-37,3-56 c.8-17.9-5.9-37.6-8-55.4,5.3-1.6,9.5-5.9,14.3-8.2,20.8-10.1,49.1-9.7,68.5,3.4Z',
  },
  // LEFT CALF / LOWER LEG
  {
    id: 'l-calf', label: 'Left Calf', side: 'left', anatomyGroup: 'calf',
    tooltipX: 438, tooltipY: 1145,
    svgPath: 'M 397,1300 c .1-18.1,-.2-36.4-2-54.5-4.3-41.5-16.8-81.8-14-124s7.7-32.7,9-48-1.6-29.2,.9-43.1 c23.5-16.9,59.9-13.6,81.7,5-3.7,20.6-8.7,39.8-7.7,61.1s4,40.2,.8,60.9 c-2.5,16.2-9.7,32.3-13.8,48.2-7.3,28.2-10.1,57-12.1,85.9-.1,1.8,.8,7.3,.6,7.6-2.5,3.8-37.3,1.5-43.6,.9Z',
  },
  // RIGHT FOOT
  {
    id: 'r-foot', label: 'Right Foot', side: 'right', anatomyGroup: 'foot',
    tooltipX: 592, tooltipY: 1310,
    svgPath: 'M 617,1304 c -.6,16.4,4.5,26.9,11.8,40.7s15.9,28.3,28.2,39.8 c3.5,3.3,8.3,5.4,11.5,9.5,4.5,5.8,7,16.7,1.4,22.5-9.9,10.2-34,15.6-47.8,12.9-6.1-1.2-17.4-7.8-22.1-11.9-7.3-6.4-7.5-16.4-13.7-24.3-6.5-8.4-18.4-11.5-21.1-21.9-4.3-16.2,3.1-23.1,4.6-36.8,.7-6.2,-.3-12.7,0-18.9s1.2-10,1.5-10.5 c1.2-1.9,39.6,2.1,45.6,-.9Z',
  },
  // LEFT FOOT
  {
    id: 'l-foot', label: 'Left Foot', side: 'left', anatomyGroup: 'foot',
    tooltipX: 443, tooltipY: 1310,
    svgPath: 'M 441,1304 c 2.3,9.2,0,19,1.1,28.4,1.6,14.7,10.5,22.1,5.7,39.9-2.5,9.2-14.2,13-20.2,20.8-5.3,7-5.8,15.1-10.6,21.4s-19.4,15.1-29.4,15.6-30.9-4.2-41.1-13 c-16.9-14.7,14.2-35.4,22.5-45.5s22.3-36,25-46s.1-14.2,2.1-21.4 c15,1.7,29.9,2.1,44.9,0Z',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
interface Props {
  selectedRegions: SelectedRegion[];
  successToast: string | null;
  onRegionTap: (r: BodyRegion) => void;
  onRemoveRegion: (id: string) => void;
  onClearAll: () => void;
  onContinue: () => void;
  onBack: () => void;
}

export default function BodyMapScreen({
  selectedRegions, successToast,
  onRegionTap, onRemoveRegion, onClearAll, onContinue, onBack,
}: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [view, setView] = useState<'front' | 'back'>('front');
  const selectedIds = selectedRegions.map(s => s.region.id);
  const count = selectedRegions.length;
  const hoveredRegion = BODY_REGIONS.find(r => r.id === hoveredId) ?? null;

  const regionFill = (r: BodyRegion): string => {
    if (selectedIds.includes(r.id)) return C.selected;
    if (hoveredId === r.id) return C.hover;
    return C.bodyFill;
  };

  // Tooltip sizing in SVG coordinate space (viewBox 0 0 1023 1537)
  const tooltipW = (label: string) => Math.max(300, label.length * 33 + 80);

  return (
    <div style={{ backgroundColor: C.bg, display: 'flex', flexDirection: 'column', height: '100%', fontFamily: font.heading, position: 'relative' }}>
      <StatusBar />

      {/* Success toast */}
      <div style={{
        position: 'absolute', top: 58, left: 20, right: 20, zIndex: 50,
        backgroundColor: '#1A1A2E', color: '#FFF', borderRadius: 14,
        padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10,
        boxShadow: '0 4px 20px rgba(0,0,0,0.18)',
        transform: successToast ? 'translateY(0)' : 'translateY(-80px)',
        opacity: successToast ? 1 : 0,
        transition: 'transform 0.32s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s',
        pointerEvents: 'none',
      }}>
        <span style={{ width: 22, height: 22, borderRadius: '50%', backgroundColor: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0 }}>✓</span>
        <span style={{ fontFamily: font.body, fontSize: 13, fontWeight: 500 }}>{successToast}</span>
      </div>

      {/* Header */}
      <div style={{ padding: '4px 20px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onBack} style={iconBtn}>
          <svg width="9" height="16" viewBox="0 0 9 16" fill="none">
            <path d="M8 1L1 8L8 15" stroke={C.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 style={{ margin: 0, fontWeight: 800, fontSize: 20, color: C.text, letterSpacing: '-0.3px' }}>Where does it hurt?</h1>
      </div>

      {/* Info banner */}
      <div style={{
        margin: '0 16px 8px', padding: '10px 14px', borderRadius: 12, flexShrink: 0,
        backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ color: '#FFF', fontSize: 11, fontWeight: 800 }}>i</span>
        </div>
        <p style={{ margin: 0, fontFamily: font.body, fontSize: 13, color: '#1E40AF', fontWeight: 500 }}>
          Tap on the body to select one or more areas.
        </p>
      </div>

      {/* Body card */}
      <div style={{
        flex: 1, margin: '0 12px', borderRadius: 20,
        backgroundColor: '#F8F9FB', border: '1px solid #E5E7EB',
        display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden',
      }}>
        {/* LEFT / RIGHT labels */}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px 0', flexShrink: 0 }}>
          <span style={{ fontFamily: font.body, fontSize: 11, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.8px' }}>LEFT</span>
          <span style={{ fontFamily: font.body, fontSize: 11, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.8px' }}>RIGHT</span>
        </div>

        {/* SVG body — uses official SVG paths, viewBox 0 0 1023 1537 */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '4px 8px 0', minHeight: 0, overflow: 'hidden' }}>
          <svg
            viewBox="0 0 1023 1537"
            style={{ width: '100%', maxWidth: 240, height: 'auto', maxHeight: '100%', display: 'block' }}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Region paths — official SVG body shapes */}
            {BODY_REGIONS.map(r => (
              <path
                key={r.id}
                d={r.svgPath}
                fill={regionFill(r)}
                stroke={C.stroke}
                strokeWidth={C.strokeW}
                strokeLinejoin="round"
                style={{ cursor: 'pointer', transition: 'fill 0.15s ease' }}
                onMouseEnter={() => setHoveredId(r.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => onRegionTap(r)}
              />
            ))}

            {/* Severity dots on selected regions */}
            {selectedRegions.map(sr => {
              const lvl = sr.painLevel ? SEVERITY_COLORS[sr.painLevel] : null;
              return (
                <g key={`dot-${sr.region.id}`} pointerEvents="none">
                  <circle cx={sr.region.tooltipX} cy={sr.region.tooltipY} r={22} fill="#FFF" opacity={0.9} />
                  <circle cx={sr.region.tooltipX} cy={sr.region.tooltipY} r={16} fill={lvl?.dot ?? C.selected} />
                </g>
              );
            })}

            {/* Hover tooltip */}
            {hoveredId && hoveredRegion && !selectedIds.includes(hoveredId) && (() => {
              const tw = tooltipW(hoveredRegion.label);
              const tx = Math.min(Math.max(hoveredRegion.tooltipX, tw / 2 + 20), 1023 - tw / 2 - 20);
              const ty = hoveredRegion.tooltipY;
              return (
                <g pointerEvents="none">
                  <rect x={tx - tw / 2} y={ty - 96} width={tw} height={90} rx={28} fill="#1A1A2E" opacity={0.9} />
                  <text x={tx} y={ty - 36} textAnchor="middle" fill="#FFF" fontSize="46" fontFamily="Inter, sans-serif" fontWeight="600">
                    {hoveredRegion.label}
                  </text>
                </g>
              );
            })()}
          </svg>
        </div>

        {/* Front / Back toggle */}
        <div style={{ padding: '6px 20px 12px', display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
          <div style={{ display: 'flex', backgroundColor: '#FFF', borderRadius: 14, border: '1px solid #E5E7EB', padding: 3, gap: 2 }}>
            {(['front', 'back'] as const).map(v => (
              <button key={v} onClick={() => setView(v)} style={{
                padding: '7px 28px', borderRadius: 11, border: 'none', cursor: 'pointer',
                fontFamily: font.heading, fontWeight: 600, fontSize: 13,
                backgroundColor: view === v ? C.primary : 'transparent',
                color: view === v ? '#FFF' : C.sub,
                transition: 'all 0.15s ease',
                textTransform: 'capitalize',
              }}>
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Selected chips */}
      {count > 0 && (
        <div style={{ padding: '8px 12px 0', flexShrink: 0 }}>
          <div style={{ backgroundColor: '#FFF', borderRadius: 16, padding: '10px 14px', border: `1px solid ${C.border}`, boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
              <span style={{ fontFamily: font.heading, fontWeight: 700, fontSize: 12, color: C.text }}>Selected ({count})</span>
              <button onClick={onClearAll} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: font.body, fontSize: 11, color: C.sub }}>Clear all</button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {selectedRegions.map(sr => (
                <div key={sr.region.id} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  backgroundColor: C.chipBg(sr.painLevel), border: `1px solid ${C.chipBorder(sr.painLevel)}`,
                  borderRadius: 9999, padding: '4px 9px 4px 7px',
                }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: C.chipDot(sr.painLevel), flexShrink: 0 }} />
                  <span style={{ fontFamily: font.body, fontSize: 11, fontWeight: 500, color: C.text }}>{sr.region.label}</span>
                  <button onClick={() => onRemoveRegion(sr.region.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.sub, fontSize: 14, lineHeight: 1, padding: '0 0 0 1px', display: 'flex' }}>×</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ padding: '10px 20px 32px', flexShrink: 0 }}>
        {count === 0
          ? <p style={{ textAlign: 'center', fontFamily: font.body, fontSize: 13, color: C.sub, margin: 0 }}>Tap any region above to begin</p>
          : <button onClick={onContinue} style={{
              width: '100%', padding: '16px 0', borderRadius: 18, border: 'none',
              backgroundColor: C.primary, cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(47,128,255,0.32)',
              fontFamily: font.heading, fontWeight: 700, fontSize: 16, color: '#FFF',
            }}>
              Continue →
            </button>
        }
      </div>
    </div>
  );
}

const iconBtn: React.CSSProperties = {
  width: 38, height: 38, borderRadius: 12, backgroundColor: '#FFF',
  border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center',
  justifyContent: 'center', cursor: 'pointer', flexShrink: 0,
  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
};
