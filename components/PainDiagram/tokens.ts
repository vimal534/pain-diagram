export const colors = {
  bg: '#F2F4F8',
  primary: '#2487F5',
  primaryDark: '#1A6FD4',
  secondary: '#5C5CE6',
  text: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  border: '#E5E7EB',
  cardBg: '#FFFFFF',
  selectedBg: 'rgba(36, 135, 245, 0.08)',
  orange: '#F97316',
  orangeBg: '#FFF7ED',
  yellow: '#F59E0B',
  yellowBg: '#FFFBEB',
  red: '#EF4444',
  redBg: '#FEF2F2',
  green: '#10B981',
  greenBg: '#ECFDF5',
  zoneBorder: 'rgba(120, 130, 170, 0.35)',
  zoneFill: 'rgba(200, 210, 240, 0.15)',
};

export const radius = {
  card: 24,
  button: 18,
  chip: 50,    // fully rounded pills
  sheet: 28,
  badge: 8,
};

export const shadow = {
  card: '0px 1px 12px rgba(0,0,0,0.07)',
  sheet: '0px -4px 40px rgba(0,0,0,0.14)',
  button: '0px 4px 16px rgba(36,135,245,0.28)',
  toast: '0px 4px 20px rgba(0,0,0,0.15)',
};

export const font = {
  heading: '"Plus Jakarta Sans", sans-serif',
  body: '"Inter", sans-serif',
};

export const SEVERITY_COLORS: Record<string, { dot: string; bg: string; border: string; text: string }> = {
  mild:     { dot: '#F59E0B', bg: '#FFFBEB', border: '#F59E0B', text: '#92400E' },
  moderate: { dot: '#F97316', bg: '#FFF7ED', border: '#F97316', text: '#9A3412' },
  severe:   { dot: '#EF4444', bg: '#FEF2F2', border: '#EF4444', text: '#991B1B' },
};
