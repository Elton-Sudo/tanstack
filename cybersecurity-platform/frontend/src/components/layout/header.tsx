'use client';

import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { useTenantBranding } from '@/hooks/useTenantBranding';
import { useAuthStore } from '@/store/auth.store';
import { Bell, LogOut, Menu, Settings, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const { logo, name } = useTenantBranding();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 md:px-6">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="mr-4 inline-flex items-center justify-center rounded-md p-2 hover:bg-accent lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Logo - Custom tenant branding (empty by default) */}
        {logo && (
          <div className="flex items-center space-x-2">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <img src={logo} alt={name || 'Logo'} className="h-8 w-auto" />
            </Link>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right side actions */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <button className="relative rounded-full p-2 hover:bg-accent">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
          </button>

          {/* User menu */}
          <div className="flex items-center space-x-3">
            <div className="hidden text-right text-sm md:block">
              <p className="font-medium">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-muted-foreground">{user?.role}</p>
            </div>
            <div className="relative">
              <button className="flex items-center space-x-2 rounded-full bg-accent p-2">
                <User className="h-5 w-5" />
              </button>
              {/* Dropdown menu can be added here */}
            </div>
          </div>

          {/* Settings */}
          <Link href="/settings" className="hidden rounded-full p-2 hover:bg-accent md:block">
            <Settings className="h-5 w-5" />
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="hidden rounded-full p-2 hover:bg-accent md:block"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
