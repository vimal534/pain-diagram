import React from 'react';
import { C } from './tokens';

interface ChipSelectorProps {
  options: string[];
  selected: string[];
  multiSelect?: boolean;
  onToggle: (value: string) => void;
}

export default function ChipSelector({ options, selected, onToggle }: ChipSelectorProps) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingTop: 8 }}>
      {options.map((option) => {
        const isSelected = selected.includes(option);
        return (
          <button
            key={option}
            onClick={() => onToggle(option)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '9px 14px',
              borderRadius: 12,
              border: `1.5px solid ${isSelected ? C.primary : C.border}`,
              backgroundColor: isSelected ? C.primaryLight : '#FFFFFF',
              cursor: 'pointer',
              outline: 'none',
              transition: 'all 0.12s ease',
            }}
          >
            {isSelected && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.primary} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            )}
            <span
              style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontWeight: isSelected ? 600 : 500,
                fontSize: 14,
                lineHeight: '20px',
                color: isSelected ? C.primary : C.textPrimary,
                whiteSpace: 'nowrap',
              }}
            >
              {option}
            </span>
          </button>
        );
      })}
    </div>
  );
}
