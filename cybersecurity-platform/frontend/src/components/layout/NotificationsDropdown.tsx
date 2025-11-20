/**
 * Notifications Dropdown Component
 * Shows recent notifications with mark as read functionality
 */

'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Bell } from 'lucide-react';
import React from 'react';

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

/**
 * NotificationsDropdown
 * Bell icon with dropdown showing recent notifications
 */
export default function NotificationsDropdown() {
  // TODO: Replace with real notification data from API
  const [notifications] = React.useState<Notification[]>([
    {
      id: '1',
      title: 'New Course Available',
      message: 'Introduction to Cybersecurity is now available',
      timestamp: '5 minutes ago',
      read: false,
      type: 'info',
    },
    {
      id: '2',
      title: 'Assessment Due Soon',
      message: 'Security Fundamentals quiz due in 2 days',
      timestamp: '1 hour ago',
      read: false,
      type: 'warning',
    },
    {
      id: '3',
      title: 'Certificate Earned',
      message: 'You completed Network Security course',
      timestamp: '3 hours ago',
      read: true,
      type: 'success',
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="md" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="danger"
              className="absolute -right-1 -top-1 h-5 min-w-[20px] rounded-full px-1 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Badge variant="default" className="ml-2">
              {unreadCount} new
            </Badge>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">No notifications</div>
        ) : (
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={cn(
                  'flex cursor-pointer flex-col items-start gap-1 p-3',
                  !notification.read && 'bg-accent/50',
                )}
              >
                <div className="flex w-full items-start justify-between gap-2">
                  <span className="font-medium text-sm">{notification.title}</span>
                  {!notification.read && <div className="h-2 w-2 rounded-full bg-brand-blue" />}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{notification.message}</p>
                <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
              </DropdownMenuItem>
            ))}
          </div>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-center text-center text-sm font-medium">
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
