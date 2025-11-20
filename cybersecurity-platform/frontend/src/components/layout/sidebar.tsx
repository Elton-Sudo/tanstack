/**
 * Enhanced Sidebar Component
 * Main navigation sidebar with collapsible support and role-based filtering
 */

'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  filterNavigationByRole,
  navigationItems,
  type NavigationItem,
} from '@/constants/navigation';
import { useSidebar } from '@/hooks/useSidebar';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

/**
 * Sidebar
 * Responsive navigation sidebar with:
 * - Desktop: Collapsible sidebar
 * - Mobile: Drawer overlay
 * - Role-based navigation filtering
 * - Active route highlighting
 * - User profile section
 */
export default function Sidebar() {
  const pathname = usePathname();
  const { collapsed, mobileOpen, toggle, closeMobile } = useSidebar();
  const { user } = useAuthStore();

  // Filter navigation based on user role
  const filteredNavigation = React.useMemo(() => {
    if (!user) return [];
    return filterNavigationByRole(navigationItems, user.role);
  }, [user]);

  // Get user initials for avatar
  const userInitials =
    user?.firstName && user?.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
      : user?.email[0]?.toUpperCase() || 'U';

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={closeMobile} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-screen border-r bg-background transition-all duration-300',
          'md:relative md:translate-x-0',
          collapsed ? 'w-16' : 'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between border-b px-4">
            {!collapsed && (
              <div className="flex items-center gap-2">
                <div className="relative h-8 w-8">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-brand-blue">
                    <span className="text-lg font-bold text-white">C</span>
                  </div>
                </div>
                <span className="font-bold text-foreground">CyberSec</span>
              </div>
            )}

            {/* Mobile Close / Desktop Toggle */}
            <Button
              variant="ghost"
              size="md"
              onClick={() => (mobileOpen ? closeMobile() : toggle())}
              className={cn('h-8 w-8 p-0', collapsed && 'mx-auto')}
            >
              {mobileOpen ? (
                <X className="h-4 w-4" />
              ) : collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-2 py-4">
            <ul className="space-y-1">
              {filteredNavigation.map((item) => (
                <SidebarItem
                  key={item.id}
                  item={item}
                  pathname={pathname}
                  collapsed={collapsed}
                  onNavigate={closeMobile}
                />
              ))}
            </ul>
          </nav>

          {/* User Profile Section */}
          {user && (
            <div className="border-t p-3">
              {collapsed ? (
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="bg-brand-blue text-white text-xs">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-brand-blue text-white text-xs">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-sm font-medium">
                      {user.firstName && user.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : user.email}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user.role?.replace('_', ' ').toLowerCase()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

/**
 * SidebarItem Component
 * Individual navigation item with support for children
 */
interface SidebarItemProps {
  item: NavigationItem;
  pathname: string;
  collapsed: boolean;
  onNavigate: () => void;
  level?: number;
}

function SidebarItem({ item, pathname, collapsed, onNavigate, level = 0 }: SidebarItemProps) {
  const [expanded, setExpanded] = React.useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const isActive = pathname === item.href;
  const isParentActive = hasChildren && item.children?.some((child) => pathname === child.href);

  const handleClick = (e: React.MouseEvent) => {
    if (hasChildren) {
      e.preventDefault();
      setExpanded(!expanded);
    } else {
      onNavigate();
    }
  };

  return (
    <li>
      <Link
        href={item.href}
        onClick={handleClick}
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          'hover:bg-accent hover:text-accent-foreground',
          isActive && 'bg-brand-blue text-white hover:bg-brand-blue/90',
          isParentActive && !isActive && 'bg-accent',
          collapsed && 'justify-center',
          level > 0 && 'ml-4',
        )}
        title={collapsed ? item.label : undefined}
      >
        <item.icon className="h-5 w-5 shrink-0" />
        {!collapsed && (
          <>
            <span className="flex-1">{item.label}</span>
            {item.badge && (
              <span className="rounded-full bg-brand-blue px-2 py-0.5 text-xs text-white">
                {item.badge}
              </span>
            )}
            {hasChildren && (
              <ChevronRight
                className={cn('h-4 w-4 transition-transform', expanded && 'rotate-90')}
              />
            )}
          </>
        )}
      </Link>

      {/* Child Items */}
      {hasChildren && !collapsed && expanded && (
        <ul className="ml-3 mt-1 space-y-1 border-l pl-3">
          {item.children?.map((child) => (
            <SidebarItem
              key={child.id}
              item={child}
              pathname={pathname}
              collapsed={collapsed}
              onNavigate={onNavigate}
              level={level + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
