'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Bell, CheckCircle2, Info } from 'lucide-react';

export default function NotificationsPage() {
  // Mock data
  const notifications = [
    {
      id: 1,
      type: 'success',
      title: 'Course Completed',
      message: 'You completed "Phishing Awareness Training"',
      time: '2 hours ago',
      read: false,
    },
    {
      id: 2,
      type: 'warning',
      title: 'Course Deadline',
      message: 'Your course "Data Protection" is due in 3 days',
      time: '5 hours ago',
      read: false,
    },
    {
      id: 3,
      type: 'info',
      title: 'New Course Available',
      message: 'Check out "Advanced Threat Detection"',
      time: '1 day ago',
      read: true,
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-brand-green" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-brand-orange" />;
      case 'info':
        return <Info className="h-5 w-5 text-brand-blue" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Notifications</h1>
        <p className="text-muted-foreground">Stay updated with your training progress</p>
      </div>

      <div className="space-y-2">
        {notifications.map((notification) => (
          <Card
            key={notification.id}
            className={`cursor-pointer hover:shadow-lg transition-shadow ${
              !notification.read ? 'border-brand-blue' : ''
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                <div className="mt-1">{getIcon(notification.type)}</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{notification.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                    </div>
                    {!notification.read && <Badge variant="info">New</Badge>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
