/**
 * Design System - Shadow Tokens
 *
 * Elevation system using shadows to create depth and hierarchy
 * 5-level system from subtle to prominent
 */

/**
 * Shadow Tokens
 * Progressive elevation levels for different UI elements
 */
export const shadows = {
  /**
   * Level 0 - No elevation
   * Use for: Flat elements, backgrounds
   */
  none: 'none',

  /**
   * Level 1 - Subtle elevation
   * Use for: Hovered cards, slightly raised elements
   */
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',

  /**
   * Level 2 - Default elevation
   * Use for: Cards, panels, default elevated elements
   */
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',

  /**
   * Level 3 - Medium elevation
   * Use for: Dropdowns, popovers, elevated cards
   */
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',

  /**
   * Level 4 - High elevation
   * Use for: Modals, dialogs, important overlays
   */
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',

  /**
   * Level 5 - Maximum elevation
   * Use for: Notifications, toasts, alerts
   */
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',

  /**
   * Level 6 - Dramatic elevation
   * Use for: Special emphasis, hero elements
   */
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',

  /**
   * Inner shadow
   * Use for: Inset elements, wells, inputs
   */
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
} as const;

/**
 * Semantic Shadows
 * Purpose-specific shadow assignments
 */
export const semanticShadows = {
  // Card shadows
  card: shadows.DEFAULT,
  cardHover: shadows.md,
  cardInteractive: shadows.lg,

  // Button shadows
  button: shadows.sm,
  buttonHover: shadows.DEFAULT,
  buttonActive: shadows.inner,

  // Dropdown shadows
  dropdown: shadows.lg,
  popover: shadows.lg,
  tooltip: shadows.md,

  // Modal shadows
  modal: shadows.xl,
  dialog: shadows.xl,

  // Input shadows
  input: shadows.sm,
  inputFocus: '0 0 0 3px rgb(59 142 222 / 0.1)', // Blue focus ring

  // Navigation shadows
  navbar: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
  sidebar: 'none',

  // Notification shadows
  toast: shadows['2xl'],
  alert: shadows.md,

  // Table shadows
  tableHeader: shadows.sm,
  tableRow: shadows.none,
  tableRowHover: shadows.sm,
} as const;

/**
 * Focus Ring Shadows
 * Accessible focus indicators for interactive elements
 */
export const focusRings = {
  // Default focus ring
  default: '0 0 0 3px rgb(59 142 222 / 0.1)',

  // Semantic focus rings
  primary: '0 0 0 3px rgb(59 142 222 / 0.1)', // Blue
  success: '0 0 0 3px rgb(140 184 65 / 0.1)', // Green
  warning: '0 0 0 3px rgb(245 194 66 / 0.1)', // Yellow Gold
  error: '0 0 0 3px rgb(232 106 51 / 0.1)', // Orange Red

  // Size variants
  sm: '0 0 0 2px rgb(59 142 222 / 0.1)',
  lg: '0 0 0 4px rgb(59 142 222 / 0.1)',

  // High contrast for accessibility
  highContrast: '0 0 0 2px rgb(59 142 222 / 1)',
} as const;

/**
 * Glow Effects
 * Subtle glow for emphasis and states
 */
export const glowEffects = {
  // Hover glows
  hoverBlue: '0 0 20px rgb(59 142 222 / 0.15)',
  hoverGreen: '0 0 20px rgb(140 184 65 / 0.15)',
  hoverYellow: '0 0 20px rgb(245 194 66 / 0.15)',
  hoverOrange: '0 0 20px rgb(232 106 51 / 0.15)',

  // Active glows
  activeBlue: '0 0 30px rgb(59 142 222 / 0.2)',
  activeGreen: '0 0 30px rgb(140 184 65 / 0.2)',

  // Success/Error states
  success: '0 0 25px rgb(140 184 65 / 0.2)',
  error: '0 0 25px rgb(232 106 51 / 0.2)',
} as const;

/**
 * Utility function to combine shadows
 */
export const combineShadows = (...shadows: string[]): string => {
  return shadows.filter(Boolean).join(', ');
};

/**
 * Export all shadow-related tokens
 */
export const shadowTokens = {
  shadows,
  semantic: semanticShadows,
  focusRings,
  glowEffects,
  combineShadows,
} as const;

export type Shadow = keyof typeof shadows;
export type SemanticShadow = keyof typeof semanticShadows;
export type FocusRing = keyof typeof focusRings;
export type GlowEffect = keyof typeof glowEffects;
