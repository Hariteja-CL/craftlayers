export const fontSizes = {
  caption: 12,
  footnote: 12,
  bodySm: 14,
  body: 16,
  headline: 18,
  h4: 24,
  h3: 24,
  h2: 32,
  h1: 48,
} as const;

export const fontFamilies = {
  poppins: 'Poppins, sans-serif',
  mulish: 'Mulish, sans-serif',
} as const;

type FontStyle = {
  family: string;
  style: 'Regular' | 'Medium' | 'SemiBold';
  size: number;
  weight: number;
  lineHeight: number;
  letterSpacing: number;
};

export const fontStyles: Record<string, FontStyle> = {
  'headline/medium': {
    family: fontFamilies.poppins,
    style: 'Medium',
    size: fontSizes.headline,
    weight: 500,
    lineHeight: 26,
    letterSpacing: 0,
  },
  'headline/regular': {
    family: fontFamilies.poppins,
    style: 'Regular',
    size: fontSizes.headline,
    weight: 400,
    lineHeight: 26,
    letterSpacing: 0,
  },
  'headline/regular-large': {
    family: fontFamilies.poppins,
    style: 'Regular',
    size: fontSizes.headline,
    weight: 400,
    lineHeight: 32,
    letterSpacing: 0,
  },
  'headline/semibold-large': {
    family: fontFamilies.poppins,
    style: 'SemiBold',
    size: fontSizes.headline,
    weight: 600,
    lineHeight: 32,
    letterSpacing: 0,
  },
  'h1/bold': {
    family: fontFamilies.poppins,
    style: 'Medium',
    size: fontSizes.h1,
    weight: 500,
    lineHeight: 58,
    letterSpacing: 0,
  },
  'h2/regular': {
    family: fontFamilies.poppins,
    style: 'Regular',
    size: fontSizes.h2,
    weight: 400,
    lineHeight: 48,
    letterSpacing: 0,
  },
  'h3/medium': {
    family: fontFamilies.poppins,
    style: 'Medium',
    size: fontSizes.h3,
    weight: 500,
    lineHeight: 30,
    letterSpacing: 0,
  },
  'h4/regular': {
    family: fontFamilies.poppins,
    style: 'Regular',
    size: fontSizes.h4,
    weight: 400,
    lineHeight: 28,
    letterSpacing: 0,
  },
  'h4/bold': {
    family: fontFamilies.poppins,
    style: 'Medium',
    size: fontSizes.h4,
    weight: 500,
    lineHeight: 28,
    letterSpacing: 0,
  },
  'body/regular': {
    family: fontFamilies.poppins,
    style: 'Regular',
    size: fontSizes.body,
    weight: 400,
    lineHeight: 24,
    letterSpacing: 0,
  },
  'bodySmall/regular': {
    family: fontFamilies.poppins,
    style: 'Regular',
    size: fontSizes.bodySm,
    weight: 400,
    lineHeight: 20,
    letterSpacing: 0,
  },
  'caption/regular': {
    family: fontFamilies.poppins,
    style: 'Regular',
    size: fontSizes.caption,
    weight: 400,
    lineHeight: 16,
    letterSpacing: 0,
  },
  'caption/medium': {
    family: fontFamilies.poppins,
    style: 'Medium',
    size: fontSizes.caption,
    weight: 500,
    lineHeight: 16,
    letterSpacing: 0,
  },
  'footnote/regular': {
    family: fontFamilies.poppins,
    style: 'Regular',
    size: fontSizes.footnote,
    weight: 400,
    lineHeight: 16,
    letterSpacing: 0,
  },
  'subtitle/regular': {
    family: fontFamilies.poppins,
    style: 'Regular',
    size: 14,
    weight: 400,
    lineHeight: 20,
    letterSpacing: 0,
  },
  'semibold14/mulish': {
    family: fontFamilies.mulish,
    style: 'SemiBold',
    size: 14,
    weight: 600,
    lineHeight: 20,
    letterSpacing: 0.2,
  },
};

export type { FontStyle };