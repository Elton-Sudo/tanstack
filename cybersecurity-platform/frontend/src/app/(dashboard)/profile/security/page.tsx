'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Key, Smartphone } from 'lucide-react';

export default function SecuritySettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Security Settings</h1>
        <p className="text-muted-foreground">Manage your account security preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Update your password regularly to keep your account secure
          </p>
          <Button variant="outline">
            <Key className="mr-2 h-4 w-4" />
            Change Password
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Two-Factor Authentication</CardTitle>
            <Badge variant="warning">Not Enabled</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Add an extra layer of security to your account by enabling two-factor authentication
          </p>
          <Button>
            <Smartphone className="mr-2 h-4 w-4" />
            Enable 2FA
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <p className="font-medium">Current Session</p>
                <p className="text-sm text-muted-foreground">Chrome on MacOS • Now</p>
              </div>
              <Badge variant="success">Active</Badge>
            </div>
          </div>
          <Button variant="outline" className="w-full">
            Log Out All Other Sessions
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
