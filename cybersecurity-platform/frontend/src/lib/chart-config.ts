/**
 * Chart Configuration
 * Centralized configuration for all Recharts components
 * Provides consistent colors, styling, and utilities
 */

import { brandColors } from './design-system/tokens/colors';

/**
 * Chart Color Palette
 * Uses brand colors for consistency across all charts
 */
export const chartColors = {
  primary: '#3B8EDE', // Brand Blue
  success: '#8CB841', // Brand Green
  warning: '#F5C242', // Brand Yellow Gold
  error: '#E86A33', // Brand Orange Red
  gray: '#5A5A5A', // Brand Gray
  // Extended palette for multi-series charts
  palette: [
    '#3B8EDE', // Blue
    '#8CB841', // Green
    '#F5C242', // Yellow Gold
    '#E86A33', // Orange Red
    '#9B59B6', // Purple
    '#1ABC9C', // Teal
    '#E74C3C', // Red
    '#3498DB', // Light Blue
  ],
} as const;

/**
 * Cartesian Grid Configuration
 * Subtle grid lines for better readability
 */
export const cartesianGridConfig = {
  strokeDasharray: '3 3',
  stroke: 'hsl(var(--border))',
  opacity: 0.3,
} as const;

/**
 * Tooltip Styling
 * Consistent tooltip appearance across all charts
 */
export const tooltipConfig = {
  contentStyle: {
    backgroundColor: 'hsl(var(--background))',
    border: '1px solid hsl(var(--border))',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    padding: '12px',
  },
  labelStyle: {
    color: 'hsl(var(--foreground))',
    fontWeight: 600,
    marginBottom: '4px',
  },
  itemStyle: {
    color: 'hsl(var(--muted-foreground))',
    padding: '4px 0',
  },
  cursor: {
    fill: 'hsl(var(--muted))',
    opacity: 0.1,
  },
} as const;

/**
 * Axis Styling
 * Consistent axis appearance
 */
export const axisConfig = {
  tick: {
    fill: 'hsl(var(--muted-foreground))',
    fontSize: 12,
  },
  axisLine: {
    stroke: 'hsl(var(--border))',
  },
  tickLine: {
    stroke: 'hsl(var(--border))',
  },
} as const;

/**
 * Legend Configuration
 * Consistent legend styling
 */
export const legendConfig = {
  wrapperStyle: {
    paddingTop: '20px',
  },
  iconType: 'circle' as const,
  iconSize: 8,
} as const;

/**
 * Responsive Container Props
 * Standard responsive behavior for all charts
 */
export const responsiveConfig = {
  width: '100%',
  height: 300,
  debounce: 50,
} as const;

/**
 * Animation Configuration
 * Smooth animations for chart rendering
 */
export const animationConfig = {
  duration: 750,
  easing: 'ease-in-out' as const,
} as const;

/**
 * Gradient Definitions
 * Reusable gradients for area charts
 */
export const gradients = {
  primary: {
    id: 'colorPrimary',
    color: chartColors.primary,
    stops: [
      { offset: '5%', stopColor: chartColors.primary, stopOpacity: 0.8 },
      { offset: '95%', stopColor: chartColors.primary, stopOpacity: 0.1 },
    ],
  },
  success: {
    id: 'colorSuccess',
    color: chartColors.success,
    stops: [
      { offset: '5%', stopColor: chartColors.success, stopOpacity: 0.8 },
      { offset: '95%', stopColor: chartColors.success, stopOpacity: 0.1 },
    ],
  },
  warning: {
    id: 'colorWarning',
    color: chartColors.warning,
    stops: [
      { offset: '5%', stopColor: chartColors.warning, stopOpacity: 0.8 },
      { offset: '95%', stopColor: chartColors.warning, stopOpacity: 0.1 },
    ],
  },
  error: {
    id: 'colorError',
    color: chartColors.error,
    stops: [
      { offset: '5%', stopColor: chartColors.error, stopOpacity: 0.8 },
      { offset: '95%', stopColor: chartColors.error, stopOpacity: 0.1 },
    ],
  },
} as const;

/**
 * Utility function to format chart values
 */
export const formatValue = (
  value: number,
  type: 'number' | 'percent' | 'currency' = 'number',
): string => {
  switch (type) {
    case 'percent':
      return `${value}%`;
    case 'currency':
      return new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: 'ZAR',
      }).format(value);
    case 'number':
    default:
      return new Intl.NumberFormat('en-ZA').format(value);
  }
};

/**
 * Utility function to get color by index for multi-series charts
 */
export const getColorByIndex = (index: number): string => {
  return chartColors.palette[index % chartColors.palette.length];
};

/**
 * Utility function to generate gradient ID
 */
export const getGradientId = (name: string): string => {
  return `gradient-${name}`;
};
