import { useTheme } from '@/lib/theme/theme-provider';
import { useAuthStore } from '@/store/auth.store';
import { useEffect } from 'react';

/**
 * Hook to manage tenant-specific branding
 * Automatically applies tenant brand colors from the tenant settings
 */
export function useTenantBranding() {
  const { setBrandColors } = useTheme();
  const tenant = useAuthStore((state) => state.user?.tenant);

  useEffect(() => {
    if (tenant?.primaryColor && tenant?.secondaryColor) {
      setBrandColors({
        primary: tenant.primaryColor,
        secondary: tenant.secondaryColor,
      });
    }
  }, [tenant, setBrandColors]);

  return {
    logo: tenant?.logo,
    primaryColor: tenant?.primaryColor,
    secondaryColor: tenant?.secondaryColor,
    favicon: tenant?.favicon,
    name: tenant?.name,
  };
}
