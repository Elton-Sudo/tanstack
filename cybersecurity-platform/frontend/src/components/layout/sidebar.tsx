/**
 * Enhanced Sidebar Component
 * Main navigation sidebar with collapsible support and role-based filtering
 */

'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
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
          collapsed ? 'w-[72px]' : 'w-[280px]',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between border-b px-4">
            <Link href="/dashboard" className="flex items-center">
              {!collapsed ? (
                <div className="relative h-10 w-[180px]">
                  <Image
                    src="/images/swiiff-logo.png"
                    alt="SWIIFF Security"
                    fill
                    className="object-contain object-left"
                    priority
                    unoptimized
                  />
                </div>
              ) : (
                <div className="relative h-10 w-10">
                  <Image
                    src="/images/swiiff-icon.png"
                    alt="SWIIFF Security"
                    fill
                    className="object-contain"
                    priority
                    unoptimized
                  />
                </div>
              )}
            </Link>

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
          <nav className="flex-1 overflow-y-auto px-4 py-4">
            <ul className="space-y-2">
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

  const handleClick = () => {
    if (hasChildren) {
      setExpanded(!expanded);
    } else {
      onNavigate();
    }
  };

  const itemClasses = cn(
    'relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200',
    'hover:bg-muted/50 dark:hover:bg-muted/20',
    isActive &&
      'border-l-4 border-l-brand-blue-500 bg-brand-blue-50 text-brand-blue-700 dark:bg-brand-blue-950/30 dark:text-brand-blue-300',
    isParentActive && !isActive && 'bg-muted/30',
    collapsed && 'justify-center px-2',
    level > 0 && 'ml-4',
  );

  const itemContent = (
    <>
      <item.icon className="h-5 w-5 shrink-0" />
      {!collapsed && (
        <>
          <span className="flex-1">{item.label}</span>
          {item.badge && (
            <span className="rounded-full bg-brand-blue-500 px-2 py-0.5 text-xs font-medium text-white">
              {item.badge}
            </span>
          )}
          {hasChildren && (
            <ChevronRight className={cn('h-4 w-4 transition-transform', expanded && 'rotate-90')} />
          )}
        </>
      )}
    </>
  );

  return (
    <li>
      {hasChildren ? (
        <button
          onClick={handleClick}
          className={cn(itemClasses, 'w-full text-left')}
          title={collapsed ? item.label : undefined}
          type="button"
        >
          {itemContent}
        </button>
      ) : (
        <Link
          href={item.href}
          onClick={handleClick}
          className={itemClasses}
          title={collapsed ? item.label : undefined}
        >
          {itemContent}
        </Link>
      )}

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
