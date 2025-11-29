'use client';

import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';

interface BrandingConfig {
  appName?: string;
  primaryColor?: string;
  logoLight?: string | null;
  logoDark?: string | null;
}

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
  href?: string;
  branding?: BrandingConfig;
  showText?: boolean;
}

const defaultBranding: BrandingConfig = {
  appName: 'SWIIFF Security',
  primaryColor: '#3B8EDE',
  logoLight: null,
  logoDark: null,
};

export function Logo({
  width = 150,
  height = 40,
  className = '',
  href = '/',
  branding,
  showText = true,
}: LogoProps) {
  const { theme, resolvedTheme } = useTheme();
  const currentTheme = resolvedTheme || theme || 'light';

  // Merge provided branding with defaults
  const brandConfig = { ...defaultBranding, ...branding };

  // Determine which logo to use based on theme
  const customLogoUrl =
    currentTheme === 'dark' ? brandConfig.logoDark || brandConfig.logoLight : brandConfig.logoLight;

  const logoElement = (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Custom Logo or Default Icon */}
      {customLogoUrl ? (
        <div className="relative" style={{ width, height }}>
          <Image
            src={customLogoUrl}
            alt={`${brandConfig.appName} Logo`}
            fill
            className="object-contain object-left"
            priority
          />
        </div>
      ) : (
        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors"
          style={{ backgroundColor: brandConfig.primaryColor }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2L2 7L12 12L22 7L12 2Z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 17L12 22L22 17"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 12L12 17L22 12"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}

      {/* App Name - only show if no custom logo or showText is explicitly true */}
      {showText && !customLogoUrl && (
        <span
          className="text-xl font-bold text-foreground transition-colors"
          style={brandConfig.primaryColor ? { color: brandConfig.primaryColor } : undefined}
        >
          {brandConfig.appName}
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="flex items-center">
        {logoElement}
      </Link>
    );
  }

  return logoElement;
}
