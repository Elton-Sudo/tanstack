/**
 * Accessibility Utilities
 * Helper functions and hooks for improving accessibility
 */

import { useEffect } from 'react';

/**
 * Keyboard navigation helper
 * Handles common keyboard interactions
 */
export const keyboardKeys = {
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  TAB: 'Tab',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
} as const;

/**
 * Check if the pressed key is an action key (Enter or Space)
 */
export function isActionKey(event: React.KeyboardEvent): boolean {
  return event.key === keyboardKeys.ENTER || event.key === keyboardKeys.SPACE;
}

/**
 * Check if the pressed key is an arrow key
 */
export function isArrowKey(event: React.KeyboardEvent): boolean {
  return [
    keyboardKeys.ARROW_UP,
    keyboardKeys.ARROW_DOWN,
    keyboardKeys.ARROW_LEFT,
    keyboardKeys.ARROW_RIGHT,
  ].includes(event.key as any);
}

/**
 * Hook for managing focus trap within a component
 * Useful for modals and dialogs
 */
export function useFocusTrap(ref: React.RefObject<HTMLElement>, isActive: boolean) {
  useEffect(() => {
    if (!isActive || !ref.current) return;

    const element = ref.current;
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    function handleTabKey(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    }

    element.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      element.removeEventListener('keydown', handleTabKey);
    };
  }, [ref, isActive]);
}

/**
 * Hook for announcing screen reader messages
 */
export function useAnnouncement() {
  useEffect(() => {
    // Create live region if it doesn't exist
    if (!document.getElementById('sr-announcer')) {
      const announcer = document.createElement('div');
      announcer.id = 'sr-announcer';
      announcer.setAttribute('role', 'status');
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.className = 'sr-only';
      announcer.style.cssText =
        'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
      document.body.appendChild(announcer);
    }
  }, []);

  return (message: string) => {
    const announcer = document.getElementById('sr-announcer');
    if (announcer) {
      announcer.textContent = message;
    }
  };
}

/**
 * Generate accessible label for a metric with trend
 */
export function getMetricAriaLabel(
  title: string,
  value: string | number,
  trend?: { value: number; isPositive: boolean; label?: string },
): string {
  let label = `${title}: ${value}`;
  if (trend) {
    const direction = trend.isPositive ? 'increased' : 'decreased';
    label += `, ${direction} by ${Math.abs(trend.value)} percent`;
    if (trend.label) {
      label += ` ${trend.label}`;
    }
  }
  return label;
}

/**
 * Generate accessible label for a chart
 */
export function getChartAriaLabel(
  title: string,
  description?: string,
  dataPoints?: number,
): string {
  let label = `${title} chart`;
  if (description) {
    label += `. ${description}`;
  }
  if (dataPoints) {
    label += `. Contains ${dataPoints} data points`;
  }
  return label;
}

/**
 * Generate unique ID for accessibility labels
 */
let idCounter = 0;
export function generateId(prefix: string = 'a11y'): string {
  return `${prefix}-${++idCounter}`;
}

/**
 * CSS class for visually hidden but accessible to screen readers
 */
export const visuallyHiddenClass =
  'sr-only absolute left-[-10000px] w-[1px] h-[1px] overflow-hidden';

/**
 * CSS class for skip to main content link
 */
export const skipLinkClass =
  'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-brand-blue focus:text-white focus:rounded-md focus:shadow-lg';
