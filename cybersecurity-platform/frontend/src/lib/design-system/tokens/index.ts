/**
 * Design System - Token Index
 *
 * Centralized export of all design tokens for SWIIFF platform
 * Import from this file to access all design system tokens
 */

export * from './colors';
export * from './shadows';
export * from './spacing';
export * from './typography';

/**
 * Re-export commonly used tokens for convenience
 */
export { brandColors, colors, colorScales, semanticColors } from './colors';
export { focusRings, semanticShadows, shadows, shadowTokens } from './shadows';
export { borderRadius, semanticSpacing, spacing, zIndex } from './spacing';
export { fontFamilies, fontSizes, fontWeights, textStyles, typography } from './typography';
