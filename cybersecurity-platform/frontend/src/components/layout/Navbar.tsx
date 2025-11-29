/**
 * Navbar Component
 * Top navigation bar with search, notifications, and user menu
 */

'use client';

import NotificationsDropdown from '@/components/layout/NotificationsDropdown';
import UserMenu from '@/components/layout/UserMenu';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSidebar } from '@/hooks/useSidebar';
import { Menu, Search } from 'lucide-react';
import React from 'react';

/**
 * Navbar
 * Top navigation bar for dashboard
 * Features:
 * - Mobile menu toggle
 * - Global search
 * - Notifications
 * - User menu
 * - Theme toggle
 */
export default function Navbar() {
  const { toggleMobile } = useSidebar();
  const [searchQuery, setSearchQuery] = React.useState('');
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement global search functionality
    console.log('Search query:', searchQuery);
  };

  // Keyboard shortcut: cmd+k or ctrl+k to focus search
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6 shadow-sm">
      {/* Mobile Menu Toggle */}
      <Button
        variant="ghost"
        size="md"
        className="h-10 w-10 p-0 md:hidden"
        onClick={toggleMobile}
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Search Bar - Desktop */}
      <form onSubmit={handleSearch} className="hidden flex-1 md:flex md:max-w-md lg:max-w-lg">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={searchInputRef}
            type="search"
            placeholder="Search courses, users, reports..."
            className="w-full pl-9 pr-20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      </form>

      {/* Right Side Actions */}
      <div className="ml-auto flex items-center gap-2">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <NotificationsDropdown />

        {/* User Menu */}
        <UserMenu />
      </div>
    </header>
  );
}
