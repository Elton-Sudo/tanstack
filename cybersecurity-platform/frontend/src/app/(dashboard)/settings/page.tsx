'use client';

import { AlertConfig } from '@/components/alert-config';
import { BrandingConfigPanel } from '@/components/branding-config';
import { ThemeToggleAdvanced } from '@/components/theme-toggle-advanced';
import { Bell, Palette, Settings as SettingsIcon, Zap } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'appearance' | 'alerts' | 'branding'>('appearance');

  const tabs = [
    {
      id: 'appearance' as const,
      label: 'Appearance',
      icon: Palette,
      description: 'Theme and display preferences',
    },
    {
      id: 'alerts' as const,
      label: 'Alerts',
      icon: Bell,
      description: 'Configure automated notifications',
    },
    {
      id: 'branding' as const,
      label: 'Branding',
      icon: Zap,
      description: 'Customize platform appearance',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <SettingsIcon className="h-8 w-8 text-brand-blue" />
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>
        <p className="text-muted-foreground">
          Manage your platform configuration and preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-brand-blue text-brand-blue font-medium'
                    : 'border-transparent hover:border-muted-foreground/30'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="py-4">
        {activeTab === 'appearance' && (
          <div className="space-y-6">
            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Palette className="h-5 w-5 text-brand-blue" />
                Theme Selection
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Choose your preferred color theme for the platform
              </p>
              <ThemeToggleAdvanced />
            </div>

            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-lg font-semibold mb-4">Display Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Compact Mode</p>
                    <p className="text-sm text-muted-foreground">Reduce spacing and padding</p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-muted">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Show Animations</p>
                    <p className="text-sm text-muted-foreground">Enable smooth transitions</p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-brand-green">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Mobile Optimizations</p>
                    <p className="text-sm text-muted-foreground">Auto-enabled on mobile devices</p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-brand-green">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'alerts' && <AlertConfig />}

        {activeTab === 'branding' && <BrandingConfigPanel />}
      </div>
    </div>
  );
}
