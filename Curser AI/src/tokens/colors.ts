export const greys = {
  en: {
    gray0: '#ffffff',
    gray100: '#f0f4f5',
    gray200: '#d5dbde',
    gray300s: '#a1a6a8',
    gray400: '#73787a',
    gray500: '#505355',
    gray600: '#383b3c',
    gray700: '#2b2d2e',
    gray800Text: '#18191a',
    gray1000: '#000000',
  },
  base: {
    white: '#ffffff',
    gray0: '#ffffff',
    gray10: '#fcfcfd',
    gray20Bg: '#f8fafb',
    gray100: '#f0f4f5',
    gray200: '#d5dbde',
    gray300s: '#a1a6a8',
    gray400: '#73787a',
    gray500: '#505355',
    gray600: '#383b3c',
    gray700: '#2B2D2E',
    gray800Text: '#18191a',
  },
} as const;

const teal500 = '#308282';
const teal700 = '#1a5050';
const orangePrimary = '#ffa500';
const primary200 = '#ffcc80';

export const primary = {
  enTeal500: teal500,
  enTeal700: teal700,
  tealDark: teal500,
  primaryTeal500: orangePrimary,
  primaryMain200: primary200,
} as const;

export const semantic = {
  success500: '#0fa251',
  warning500: '#f5a623',
  secondaryPurple500: '#a246f0',
  info100: '#e5f2ff',
} as const;

export const pastel = {
  green100: '#e7f8f0',
  green600: '#38b784',
  yellow700: '#e6a900',
  coral600: '#f2785c',
  blue50: '#f3f8fe',
  blue100: '#eaf6fd',
  blue300: '#bee6f9',
  blue400: '#76c1fa',
} as const;

export const accents = {
  accent1: '#a7b6f7',
  accent2: '#81d7ae',
  accent3: '#ffdd6c',
  accent4: '#ffb4a2',
} as const;

export const colors = {
  greys,
  primary,
  semantic,
  pastel,
  accents,
} as const;