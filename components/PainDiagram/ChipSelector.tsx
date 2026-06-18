import React from 'react';

interface ChipSelectorProps {
  options: string[];
  selected: string[];
  multiSelect?: boolean;
  onToggle: (value: string) => void;
}

const colors = {
  primary: '#2487F5',
  selectedBg: 'rgba(36, 135, 245, 0.08)',
  borderDefault: '#E5E7EB',
  textPrimary: '#101828',
  textSecondary: '#4A5565',
};

export default function ChipSelector({
  options,
  selected,
  multiSelect = false,
  onToggle,
}: ChipSelectorProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        paddingTop: 8,
      }}
    >
      {options.map((option) => {
        const isSelected = selected.includes(option);
        return (
          <button
            key={option}
            onClick={() => onToggle(option)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '9px 15px',
              borderRadius: 16,
              border: `1.5px solid ${isSelected ? colors.primary : colors.borderDefault}`,
              backgroundColor: isSelected ? colors.selectedBg : '#FFFFFF',
              cursor: 'pointer',
              outline: 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <span
              style={{
                fontFamily: isSelected ? 'Inter, sans-serif' : 'Plus Jakarta Sans, sans-serif',
                fontWeight: 500,
                fontSize: 14,
                lineHeight: '20px',
                color: isSelected ? colors.primary : colors.textPrimary,
                whiteSpace: 'nowrap',
              }}
            >
              {isSelected ? `✓ ${option}` : option}
            </span>
          </button>
        );
      })}
    </div>
  );
}
