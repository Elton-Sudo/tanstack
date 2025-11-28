/**
 * Design System - Color Tokens
 *
 * Professional enterprise color system for SWIIFF platform
 * Based on new brand guidelines with HSL color space for better theme support
 */

export interface ColorToken {
  hex: string;
  hsl: string;
  rgb: string;
}

/**
 * Brand Colors - Primary palette
 */
export const brandColors = {
  blue: {
    hex: '#3B8EDE',
    hsl: '210 78% 56%',
    rgb: '59 142 222',
    name: 'Brand Blue',
  },
  orangeRed: {
    hex: '#E86A33',
    hsl: '17 78% 56%',
    rgb: '232 106 51',
    name: 'Brand Orange Red',
  },
  green: {
    hex: '#8CB841',
    hsl: '82 48% 50%',
    rgb: '140 184 65',
    name: 'Brand Green',
  },
  yellowGold: {
    hex: '#F5C242',
    hsl: '45 89% 61%',
    rgb: '245 194 66',
    name: 'Brand Yellow Gold',
  },
  grayText: {
    hex: '#5A5A5A',
    hsl: '0 0% 35%',
    rgb: '90 90 90',
    name: 'Brand Gray Text',
  },
} as const;

/**
 * Semantic Colors - Mapped to brand colors for consistent usage
 */
export const semanticColors = {
  primary: brandColors.blue,
  success: brandColors.green,
  warning: brandColors.yellowGold,
  error: brandColors.orangeRed,
  info: brandColors.blue,
} as const;

/**
 * Extended Color Scales
 * Lighter and darker variants for hover states, backgrounds, etc.
 */
export const colorScales = {
  blue: {
    50: { hsl: '210 100% 97%', hex: '#EDF7FF' },
    100: { hsl: '210 100% 95%', hex: '#DBF0FF' },
    200: { hsl: '210 100% 90%', hex: '#B7E0FF' },
    300: { hsl: '210 100% 80%', hex: '#6FC1FF' },
    400: { hsl: '210 90% 68%', hex: '#4AA7F0' },
    500: { hsl: '210 78% 56%', hex: '#3B8EDE' }, // Base
    600: { hsl: '210 78% 48%', hex: '#2D7ACC' },
    700: { hsl: '210 78% 40%', hex: '#2466B9' },
    800: { hsl: '210 78% 32%', hex: '#1B52A6' },
    900: { hsl: '210 78% 24%', hex: '#123E93' },
  },
  green: {
    50: { hsl: '82 60% 95%', hex: '#F5F9EC' },
    100: { hsl: '82 58% 90%', hex: '#EBF4D9' },
    200: { hsl: '82 55% 80%', hex: '#D7E9B3' },
    300: { hsl: '82 52% 70%', hex: '#C3DE8D' },
    400: { hsl: '82 50% 60%', hex: '#A8CC67' },
    500: { hsl: '82 48% 50%', hex: '#8CB841' }, // Base
    600: { hsl: '82 48% 42%', hex: '#74A034' },
    700: { hsl: '82 48% 34%', hex: '#5C8827' },
    800: { hsl: '82 48% 26%', hex: '#44701A' },
    900: { hsl: '82 48% 18%', hex: '#2C580D' },
  },
  orangeRed: {
    50: { hsl: '17 100% 96%', hex: '#FFF4EF' },
    100: { hsl: '17 100% 92%', hex: '#FFE9DF' },
    200: { hsl: '17 100% 84%', hex: '#FFD3BF' },
    300: { hsl: '17 90% 72%', hex: '#FFB79F' },
    400: { hsl: '17 85% 64%', hex: '#F89169' },
    500: { hsl: '17 78% 56%', hex: '#E86A33' }, // Base
    600: { hsl: '17 78% 48%', hex: '#D65820' },
    700: { hsl: '17 78% 40%', hex: '#C4460D' },
    800: { hsl: '17 78% 32%', hex: '#B23400' },
    900: { hsl: '17 78% 24%', hex: '#A02200' },
  },
  yellowGold: {
    50: { hsl: '45 100% 97%', hex: '#FFFCF0' },
    100: { hsl: '45 100% 94%', hex: '#FFF9E1' },
    200: { hsl: '45 98% 88%', hex: '#FFF3C3' },
    300: { hsl: '45 95% 78%', hex: '#FFE8A5' },
    400: { hsl: '45 92% 70%', hex: '#FADB87' },
    500: { hsl: '45 89% 61%', hex: '#F5C242' }, // Base
    600: { hsl: '45 89% 53%', hex: '#E3AF24' },
    700: { hsl: '45 89% 45%', hex: '#D19C06' },
    800: { hsl: '45 89% 37%', hex: '#BF8900' },
    900: { hsl: '45 89% 29%', hex: '#AD7600' },
  },
  gray: {
    50: { hsl: '0 0% 98%', hex: '#FAFAFA' },
    100: { hsl: '0 0% 96%', hex: '#F5F5F5' },
    200: { hsl: '0 0% 90%', hex: '#E5E5E5' },
    300: { hsl: '0 0% 80%', hex: '#CCCCCC' },
    400: { hsl: '0 0% 60%', hex: '#999999' },
    500: { hsl: '0 0% 35%', hex: '#5A5A5A' }, // Base
    600: { hsl: '0 0% 28%', hex: '#474747' },
    700: { hsl: '0 0% 21%', hex: '#353535' },
    800: { hsl: '0 0% 14%', hex: '#232323' },
    900: { hsl: '0 0% 7%', hex: '#111111' },
  },
} as const;

/**
 * Neutral Colors - For backgrounds, borders, text
 */
export const neutralColors = {
  white: { hsl: '0 0% 100%', hex: '#FFFFFF', rgb: '255 255 255' },
  black: { hsl: '0 0% 0%', hex: '#000000', rgb: '0 0 0' },
  transparent: 'transparent',
} as const;

/**
 * Utility function to get CSS variable format
 */
export const getCssVar = (colorName: string): string => {
  return `hsl(var(--${colorName}))`;
};

/**
 * Utility function to get HSL values for Tailwind config
 */
export const getHslValues = (hsl: string): string => {
  return hsl;
};

/**
 * Export all colors for use in Tailwind config
 */
export const colors = {
  brand: brandColors,
  semantic: semanticColors,
  scales: colorScales,
  neutral: neutralColors,
} as const;

export type BrandColorKey = keyof typeof brandColors;
export type SemanticColorKey = keyof typeof semanticColors;
export type ColorScaleKey = keyof typeof colorScales;
