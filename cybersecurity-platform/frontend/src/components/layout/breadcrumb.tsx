'use client';

import { ChevronRight, Home, LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Breadcrumb {
  name: string;
  href: string;
  icon?: LucideIcon;
}

export function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  const breadcrumbs: Breadcrumb[] = [
    { name: 'Home', href: '/dashboard', icon: Home },
    ...segments.map((segment, index) => {
      const href = '/' + segments.slice(0, index + 1).join('/');
      const name = segment
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      return { name, href };
    }),
  ];

  if (segments.length === 0 || pathname === '/dashboard') {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
      {breadcrumbs.map((breadcrumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        const Icon = breadcrumb.icon;

        return (
          <div key={breadcrumb.href} className="flex items-center space-x-2">
            {index > 0 && <ChevronRight className="h-4 w-4" />}
            {isLast ? (
              <span className="font-medium text-foreground">{breadcrumb.name}</span>
            ) : (
              <Link
                href={breadcrumb.href}
                className="flex items-center space-x-1 hover:text-foreground"
              >
                {Icon && <Icon className="h-4 w-4" />}
                <span>{breadcrumb.name}</span>
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
