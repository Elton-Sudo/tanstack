'use client';

import { useTenantBranding } from '@/hooks/useTenantBranding';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  showThemeToggle?: boolean;
}

export function Header({ showThemeToggle = true }: HeaderProps) {
  const { logo, name } = useTenantBranding();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          {logo ? (
            <img src={logo} alt={name || 'Logo'} className="h-8 w-auto" />
          ) : (
            <Logo width={120} height={32} />
          )}
        </div>

        <div className="flex items-center gap-4">{showThemeToggle && <ThemeToggle />}</div>
      </div>
    </header>
  );
}
