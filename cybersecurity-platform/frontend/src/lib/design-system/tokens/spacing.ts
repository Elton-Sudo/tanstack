/**
 * Design System - Spacing Tokens
 *
 * Consistent spacing system based on 4px base unit
 * Provides predictable, harmonious spatial relationships
 */

/**
 * Base spacing unit (4px)
 */
export const BASE_UNIT = 4;

/**
 * Spacing Scale
 * All values are multiples of the base unit (4px)
 */
export const spacing = {
  0: '0', // 0px
  px: '1px', // 1px
  0.5: '0.125rem', // 2px  - BASE_UNIT * 0.5
  1: '0.25rem', // 4px  - BASE_UNIT * 1
  1.5: '0.375rem', // 6px  - BASE_UNIT * 1.5
  2: '0.5rem', // 8px  - BASE_UNIT * 2
  2.5: '0.625rem', // 10px - BASE_UNIT * 2.5
  3: '0.75rem', // 12px - BASE_UNIT * 3
  3.5: '0.875rem', // 14px - BASE_UNIT * 3.5
  4: '1rem', // 16px - BASE_UNIT * 4
  5: '1.25rem', // 20px - BASE_UNIT * 5
  6: '1.5rem', // 24px - BASE_UNIT * 6
  7: '1.75rem', // 28px - BASE_UNIT * 7
  8: '2rem', // 32px - BASE_UNIT * 8
  9: '2.25rem', // 36px - BASE_UNIT * 9
  10: '2.5rem', // 40px - BASE_UNIT * 10
  11: '2.75rem', // 44px - BASE_UNIT * 11
  12: '3rem', // 48px - BASE_UNIT * 12
  14: '3.5rem', // 56px - BASE_UNIT * 14
  16: '4rem', // 64px - BASE_UNIT * 16
  20: '5rem', // 80px - BASE_UNIT * 20
  24: '6rem', // 96px - BASE_UNIT * 24
  28: '7rem', // 112px - BASE_UNIT * 28
  32: '8rem', // 128px - BASE_UNIT * 32
  36: '9rem', // 144px - BASE_UNIT * 36
  40: '10rem', // 160px - BASE_UNIT * 40
  44: '11rem', // 176px - BASE_UNIT * 44
  48: '12rem', // 192px - BASE_UNIT * 48
  52: '13rem', // 208px - BASE_UNIT * 52
  56: '14rem', // 224px - BASE_UNIT * 56
  60: '15rem', // 240px - BASE_UNIT * 60
  64: '16rem', // 256px - BASE_UNIT * 64
  72: '18rem', // 288px - BASE_UNIT * 72
  80: '20rem', // 320px - BASE_UNIT * 80
  96: '24rem', // 384px - BASE_UNIT * 96
} as const;

/**
 * Semantic Spacing - Common use cases
 */
export const semanticSpacing = {
  // Component spacing
  componentPaddingXs: spacing[2], // 8px
  componentPaddingSm: spacing[3], // 12px
  componentPadding: spacing[4], // 16px
  componentPaddingLg: spacing[6], // 24px
  componentPaddingXl: spacing[8], // 32px

  // Gap between elements
  gapXs: spacing[1], // 4px
  gapSm: spacing[2], // 8px
  gap: spacing[4], // 16px
  gapLg: spacing[6], // 24px
  gapXl: spacing[8], // 32px

  // Section spacing
  sectionSpacingSm: spacing[8], // 32px
  sectionSpacing: spacing[12], // 48px
  sectionSpacingLg: spacing[16], // 64px
  sectionSpacingXl: spacing[20], // 80px

  // Layout spacing
  layoutSpacingSm: spacing[4], // 16px
  layoutSpacing: spacing[6], // 24px
  layoutSpacingLg: spacing[8], // 32px
  layoutSpacingXl: spacing[12], // 48px

  // Container padding
  containerPaddingMobile: spacing[4], // 16px
  containerPaddingTablet: spacing[6], // 24px
  containerPaddingDesktop: spacing[8], // 32px
} as const;

/**
 * Border Radius
 * Rounded corners for components
 */
export const borderRadius = {
  none: '0',
  sm: '0.125rem', // 2px
  DEFAULT: '0.25rem', // 4px
  md: '0.375rem', // 6px
  lg: '0.5rem', // 8px
  xl: '0.75rem', // 12px
  '2xl': '1rem', // 16px
  '3xl': '1.5rem', // 24px
  full: '9999px', // Fully rounded (pills, circles)
} as const;

/**
 * Container Max Widths
 */
export const containerMaxWidths = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  '3xl': '1920px',
} as const;

/**
 * Breakpoints - For responsive design
 */
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

/**
 * Z-Index Scale
 * Layering system for stacking order
 */
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  toast: 1600,
  tooltip: 1700,
} as const;

/**
 * Utility types
 */
export type Spacing = keyof typeof spacing;
export type SemanticSpacing = keyof typeof semanticSpacing;
export type BorderRadius = keyof typeof borderRadius;
export type ContainerMaxWidth = keyof typeof containerMaxWidths;
export type Breakpoint = keyof typeof breakpoints;
export type ZIndex = keyof typeof zIndex;
