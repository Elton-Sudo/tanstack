/**
 * Avatar Component
 * Displays user avatar with fallback to initials
 */

import { cn } from '@/lib/utils';
import * as React from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
}

/**
 * Avatar Root Component
 */
export function Avatar({ src, alt, fallback, size = 'md', className, children }: AvatarProps) {
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  };

  // If children provided, use composition pattern
  if (children) {
    return (
      <div
        className={cn(
          'relative flex items-center justify-center rounded-full overflow-hidden',
          className,
        )}
      >
        {children}
      </div>
    );
  }

  // Otherwise use simple pattern
  return (
    <div
      className={cn(
        'relative flex items-center justify-center rounded-full bg-muted overflow-hidden',
        sizeClasses[size],
        className,
      )}
    >
      {src ? (
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <span className="font-medium text-muted-foreground">
          {fallback || alt?.charAt(0) || '?'}
        </span>
      )}
    </div>
  );
}

/**
 * AvatarImage - For composition pattern
 */
export function AvatarImage({
  src,
  alt,
  className,
}: {
  src?: string;
  alt?: string;
  className?: string;
}) {
  if (!src) return null;
  return <img src={src} alt={alt} className={cn('h-full w-full object-cover', className)} />;
}

/**
 * AvatarFallback - For composition pattern
 */
export function AvatarFallback({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex h-full w-full items-center justify-center rounded-full bg-muted',
        className,
      )}
    >
      <span className="font-medium">{children}</span>
    </div>
  );
}
