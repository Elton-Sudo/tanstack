import { cn } from '@/lib/utils';
import { forwardRef, HTMLAttributes } from 'react';

export interface TypographyProps extends HTMLAttributes<HTMLElement> {
  /**
   * Typography variant - determines the HTML element and styling
   * @default 'body'
   */
  variant?:
    | 'displayLarge'
    | 'displayMedium'
    | 'displaySmall'
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'bodyLarge'
    | 'body'
    | 'bodySmall'
    | 'labelLarge'
    | 'label'
    | 'labelSmall'
    | 'caption'
    | 'captionSmall';
  /**
   * HTML element to render
   * @default auto-determined based on variant
   */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' | 'label';
  /**
   * Text color variant
   * @default 'default'
   */
  color?: 'default' | 'muted' | 'primary' | 'success' | 'warning' | 'error';
  /**
   * Text alignment
   */
  align?: 'left' | 'center' | 'right' | 'justify';
  /**
   * Font weight override
   */
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  /**
   * Truncate text with ellipsis
   * @default false
   */
  truncate?: boolean;
}

const variantStyles = {
  // Display styles - for large headings and hero text
  displayLarge: 'text-6xl font-bold leading-none tracking-tighter',
  displayMedium: 'text-5xl font-bold leading-none tracking-tighter',
  displaySmall: 'text-4xl font-bold leading-tight tracking-tight',

  // Heading styles - for section headings
  h1: 'text-3xl font-bold leading-tight tracking-tight',
  h2: 'text-2xl font-semibold leading-tight tracking-tight',
  h3: 'text-xl font-semibold leading-snug tracking-tight',
  h4: 'text-lg font-semibold leading-snug tracking-tight',

  // Body styles - for main content
  bodyLarge: 'text-lg font-normal leading-relaxed',
  body: 'text-base font-normal leading-normal',
  bodySmall: 'text-sm font-normal leading-normal',

  // Label styles - for form labels and UI elements
  labelLarge: 'text-base font-medium leading-normal',
  label: 'text-sm font-medium leading-normal',
  labelSmall: 'text-xs font-medium leading-normal',

  // Caption styles - for small text and metadata
  caption: 'text-sm font-normal leading-snug',
  captionSmall: 'text-xs font-normal leading-snug',
} as const;

const defaultElements: Record<string, string> = {
  displayLarge: 'h1',
  displayMedium: 'h1',
  displaySmall: 'h2',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  bodyLarge: 'p',
  body: 'p',
  bodySmall: 'p',
  labelLarge: 'label',
  label: 'label',
  labelSmall: 'label',
  caption: 'span',
  captionSmall: 'span',
};

const colorStyles = {
  default: 'text-foreground',
  muted: 'text-muted-foreground',
  primary: 'text-brand-blue-600 dark:text-brand-blue-400',
  success: 'text-brand-green-600 dark:text-brand-green-400',
  warning: 'text-brand-yellowGold-700 dark:text-brand-yellowGold-400',
  error: 'text-brand-orangeRed-600 dark:text-brand-orangeRed-400',
};

const alignStyles = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify',
};

const weightStyles = {
  light: 'font-light',
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold',
};

export const Typography = forwardRef<HTMLElement, TypographyProps>(
  (
    {
      variant = 'body',
      as,
      color = 'default',
      align,
      weight,
      truncate = false,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const Component = (as || defaultElements[variant] || 'p') as any;

    return (
      <Component
        ref={ref}
        className={cn(
          // Base variant styles
          variantStyles[variant],

          // Color
          colorStyles[color],

          // Alignment
          align && alignStyles[align],

          // Weight override
          weight && weightStyles[weight],

          // Truncate
          truncate && 'truncate',

          className,
        )}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

Typography.displayName = 'Typography';

// Convenience components for common use cases
export const Heading1 = forwardRef<HTMLHeadingElement, Omit<TypographyProps, 'variant'>>(
  (props, ref) => <Typography ref={ref as any} variant="h1" {...props} />,
);
Heading1.displayName = 'Heading1';

export const Heading2 = forwardRef<HTMLHeadingElement, Omit<TypographyProps, 'variant'>>(
  (props, ref) => <Typography ref={ref as any} variant="h2" {...props} />,
);
Heading2.displayName = 'Heading2';

export const Heading3 = forwardRef<HTMLHeadingElement, Omit<TypographyProps, 'variant'>>(
  (props, ref) => <Typography ref={ref as any} variant="h3" {...props} />,
);
Heading3.displayName = 'Heading3';

export const Heading4 = forwardRef<HTMLHeadingElement, Omit<TypographyProps, 'variant'>>(
  (props, ref) => <Typography ref={ref as any} variant="h4" {...props} />,
);
Heading4.displayName = 'Heading4';

export const BodyText = forwardRef<HTMLParagraphElement, Omit<TypographyProps, 'variant'>>(
  (props, ref) => <Typography ref={ref as any} variant="body" {...props} />,
);
BodyText.displayName = 'BodyText';

export const Caption = forwardRef<HTMLSpanElement, Omit<TypographyProps, 'variant'>>(
  (props, ref) => <Typography ref={ref as any} variant="caption" {...props} />,
);
Caption.displayName = 'Caption';

export const Label = forwardRef<HTMLLabelElement, Omit<TypographyProps, 'variant'>>(
  (props, ref) => <Typography ref={ref as any} variant="label" {...props} />,
);
Label.displayName = 'Label';
