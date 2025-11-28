/**
 * Design System - Typography Tokens
 *
 * Professional typography system for SWIIFF platform
 * Based on 16px base with 1.25 scale ratio for harmonious type hierarchy
 */

/**
 * Font Families
 */
export const fontFamilies = {
  sans: [
    'Inter',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
  ].join(', '),
  mono: ['"JetBrains Mono"', '"Fira Code"', 'Consolas', '"Courier New"', 'monospace'].join(', '),
} as const;

/**
 * Font Sizes - Type Scale (1.25 ratio)
 * Base size: 16px (1rem)
 */
export const fontSizes = {
  xs: {
    size: '0.75rem', // 12px
    lineHeight: '1rem', // 16px
    letterSpacing: '0.01em',
  },
  sm: {
    size: '0.875rem', // 14px
    lineHeight: '1.25rem', // 20px
    letterSpacing: '0',
  },
  base: {
    size: '1rem', // 16px
    lineHeight: '1.5rem', // 24px
    letterSpacing: '0',
  },
  lg: {
    size: '1.125rem', // 18px
    lineHeight: '1.75rem', // 28px
    letterSpacing: '-0.01em',
  },
  xl: {
    size: '1.25rem', // 20px
    lineHeight: '1.75rem', // 28px
    letterSpacing: '-0.01em',
  },
  '2xl': {
    size: '1.5rem', // 24px
    lineHeight: '2rem', // 32px
    letterSpacing: '-0.02em',
  },
  '3xl': {
    size: '1.875rem', // 30px
    lineHeight: '2.25rem', // 36px
    letterSpacing: '-0.02em',
  },
  '4xl': {
    size: '2.25rem', // 36px
    lineHeight: '2.5rem', // 40px
    letterSpacing: '-0.03em',
  },
  '5xl': {
    size: '3rem', // 48px
    lineHeight: '1',
    letterSpacing: '-0.03em',
  },
  '6xl': {
    size: '3.75rem', // 60px
    lineHeight: '1',
    letterSpacing: '-0.04em',
  },
} as const;

/**
 * Font Weights
 */
export const fontWeights = {
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
} as const;

/**
 * Line Heights
 */
export const lineHeights = {
  none: '1',
  tight: '1.25',
  snug: '1.375',
  normal: '1.5',
  relaxed: '1.625',
  loose: '2',
} as const;

/**
 * Letter Spacing
 */
export const letterSpacing = {
  tighter: '-0.04em',
  tight: '-0.02em',
  normal: '0',
  wide: '0.01em',
  wider: '0.02em',
  widest: '0.04em',
} as const;

/**
 * Text Styles - Predefined combinations for common use cases
 */
export const textStyles = {
  // Display styles
  displayLarge: {
    fontSize: fontSizes['6xl'].size,
    lineHeight: fontSizes['6xl'].lineHeight,
    fontWeight: fontWeights.bold,
    letterSpacing: fontSizes['6xl'].letterSpacing,
  },
  displayMedium: {
    fontSize: fontSizes['5xl'].size,
    lineHeight: fontSizes['5xl'].lineHeight,
    fontWeight: fontWeights.bold,
    letterSpacing: fontSizes['5xl'].letterSpacing,
  },
  displaySmall: {
    fontSize: fontSizes['4xl'].size,
    lineHeight: fontSizes['4xl'].lineHeight,
    fontWeight: fontWeights.bold,
    letterSpacing: fontSizes['4xl'].letterSpacing,
  },

  // Heading styles
  h1: {
    fontSize: fontSizes['3xl'].size,
    lineHeight: fontSizes['3xl'].lineHeight,
    fontWeight: fontWeights.bold,
    letterSpacing: fontSizes['3xl'].letterSpacing,
  },
  h2: {
    fontSize: fontSizes['2xl'].size,
    lineHeight: fontSizes['2xl'].lineHeight,
    fontWeight: fontWeights.semibold,
    letterSpacing: fontSizes['2xl'].letterSpacing,
  },
  h3: {
    fontSize: fontSizes.xl.size,
    lineHeight: fontSizes.xl.lineHeight,
    fontWeight: fontWeights.semibold,
    letterSpacing: fontSizes.xl.letterSpacing,
  },
  h4: {
    fontSize: fontSizes.lg.size,
    lineHeight: fontSizes.lg.lineHeight,
    fontWeight: fontWeights.semibold,
    letterSpacing: fontSizes.lg.letterSpacing,
  },

  // Body styles
  bodyLarge: {
    fontSize: fontSizes.lg.size,
    lineHeight: fontSizes.lg.lineHeight,
    fontWeight: fontWeights.normal,
    letterSpacing: fontSizes.lg.letterSpacing,
  },
  body: {
    fontSize: fontSizes.base.size,
    lineHeight: fontSizes.base.lineHeight,
    fontWeight: fontWeights.normal,
    letterSpacing: fontSizes.base.letterSpacing,
  },
  bodySmall: {
    fontSize: fontSizes.sm.size,
    lineHeight: fontSizes.sm.lineHeight,
    fontWeight: fontWeights.normal,
    letterSpacing: fontSizes.sm.letterSpacing,
  },

  // Label styles
  labelLarge: {
    fontSize: fontSizes.base.size,
    lineHeight: fontSizes.base.lineHeight,
    fontWeight: fontWeights.medium,
    letterSpacing: fontSizes.base.letterSpacing,
  },
  label: {
    fontSize: fontSizes.sm.size,
    lineHeight: fontSizes.sm.lineHeight,
    fontWeight: fontWeights.medium,
    letterSpacing: fontSizes.sm.letterSpacing,
  },
  labelSmall: {
    fontSize: fontSizes.xs.size,
    lineHeight: fontSizes.xs.lineHeight,
    fontWeight: fontWeights.medium,
    letterSpacing: fontSizes.xs.letterSpacing,
  },

  // Caption styles
  caption: {
    fontSize: fontSizes.sm.size,
    lineHeight: fontSizes.sm.lineHeight,
    fontWeight: fontWeights.normal,
    letterSpacing: fontSizes.sm.letterSpacing,
  },
  captionSmall: {
    fontSize: fontSizes.xs.size,
    lineHeight: fontSizes.xs.lineHeight,
    fontWeight: fontWeights.normal,
    letterSpacing: fontSizes.xs.letterSpacing,
  },

  // Code styles
  code: {
    fontSize: fontSizes.sm.size,
    lineHeight: fontSizes.sm.lineHeight,
    fontWeight: fontWeights.normal,
    fontFamily: fontFamilies.mono,
  },
  codeInline: {
    fontSize: '0.9em',
    fontFamily: fontFamilies.mono,
  },
} as const;

/**
 * Typography utilities
 */
export const typography = {
  fonts: fontFamilies,
  sizes: fontSizes,
  weights: fontWeights,
  lineHeights,
  letterSpacing,
  textStyles,
} as const;

export type FontSize = keyof typeof fontSizes;
export type FontWeight = keyof typeof fontWeights;
export type LineHeight = keyof typeof lineHeights;
export type TextStyle = keyof typeof textStyles;
