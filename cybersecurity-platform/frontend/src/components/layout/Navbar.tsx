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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement global search functionality
    console.log('Search query:', searchQuery);
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
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
            type="search"
            placeholder="Search courses, users, reports..."
            className="w-full pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
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
