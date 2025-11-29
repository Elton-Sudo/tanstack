/**
 * Tenant Branding Component
 * Allows tenant admins to customize platform branding and appearance
 */

'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Image, Palette, Upload } from 'lucide-react';
import { useState } from 'react';

interface BrandingSettings {
  appName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoLight: string | null;
  logoDark: string | null;
  favicon: string | null;
  customDomain: string;
}

export function TenantBranding() {
  const [settings, setSettings] = useState<BrandingSettings>({
    appName: 'SWIIFF Security Platform',
    primaryColor: '#3B8EDE',
    secondaryColor: '#8CB841',
    accentColor: '#F5C242',
    logoLight: null,
    logoDark: null,
    favicon: null,
    customDomain: '',
  });

  const [previewMode, setPreviewMode] = useState<'light' | 'dark'>('light');

  const handleColorChange = (field: keyof BrandingSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field: keyof BrandingSettings) => {
    // In production, this would handle file upload
    alert(`Upload ${field} - File upload would be handled here`);
  };

  const handleSave = () => {
    alert('Branding settings saved! In production, this would update the tenant configuration.');
  };

  const handleReset = () => {
    setSettings({
      appName: 'SWIIFF Security Platform',
      primaryColor: '#3B8EDE',
      secondaryColor: '#8CB841',
      accentColor: '#F5C242',
      logoLight: null,
      logoDark: null,
      favicon: null,
      customDomain: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">White-Label Customization</h2>
        <p className="text-muted-foreground">
          Customize the platform's appearance to match your brand identity
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Configuration */}
        <div className="space-y-6">
          {/* Basic Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="appName">Application Name</Label>
                <Input
                  id="appName"
                  value={settings.appName}
                  onChange={(e) => setSettings((prev) => ({ ...prev, appName: e.target.value }))}
                  placeholder="Enter application name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customDomain">Custom Domain</Label>
                <Input
                  id="customDomain"
                  value={settings.customDomain}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, customDomain: e.target.value }))
                  }
                  placeholder="app.yourcompany.com"
                />
                <p className="text-xs text-muted-foreground">
                  Configure a custom domain for your platform
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Color Scheme */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-brand-blue" />
                Color Scheme
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                      className="w-20 h-10"
                    />
                    <Input
                      value={settings.primaryColor}
                      onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                      placeholder="#3B8EDE"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={settings.secondaryColor}
                      onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                      className="w-20 h-10"
                    />
                    <Input
                      value={settings.secondaryColor}
                      onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                      placeholder="#8CB841"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="accentColor"
                      type="color"
                      value={settings.accentColor}
                      onChange={(e) => handleColorChange('accentColor', e.target.value)}
                      className="w-20 h-10"
                    />
                    <Input
                      value={settings.accentColor}
                      onChange={(e) => handleColorChange('accentColor', e.target.value)}
                      placeholder="#F5C242"
                    />
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                These colors will be applied across the entire platform
              </p>
            </CardContent>
          </Card>

          {/* Logo Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5 text-brand-blue" />
                Logo & Branding Assets
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Logo (Light Mode)</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  {settings.logoLight ? (
                    <div className="space-y-2">
                      <p className="text-sm">logo-light.png</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleFileUpload('logoLight')}
                      >
                        Replace
                      </Button>
                    </div>
                  ) : (
                    <Button variant="outline" onClick={() => handleFileUpload('logoLight')}>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Logo
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Recommended: PNG or SVG, max 200px height
                </p>
              </div>

              <div className="space-y-2">
                <Label>Logo (Dark Mode)</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  {settings.logoDark ? (
                    <div className="space-y-2">
                      <p className="text-sm">logo-dark.png</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleFileUpload('logoDark')}
                      >
                        Replace
                      </Button>
                    </div>
                  ) : (
                    <Button variant="outline" onClick={() => handleFileUpload('logoDark')}>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Logo
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Favicon</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  {settings.favicon ? (
                    <div className="space-y-2">
                      <p className="text-sm">favicon.ico</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleFileUpload('favicon')}
                      >
                        Replace
                      </Button>
                    </div>
                  ) : (
                    <Button variant="outline" onClick={() => handleFileUpload('favicon')}>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Favicon
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Recommended: ICO or PNG, 32x32px or 64x64px
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Live Preview</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant={previewMode === 'light' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPreviewMode('light')}
                  >
                    Light
                  </Button>
                  <Button
                    variant={previewMode === 'dark' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPreviewMode('dark')}
                  >
                    Dark
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div
                className={`rounded-lg border p-6 space-y-4 ${previewMode === 'dark' ? 'bg-gray-900 text-white' : 'bg-white'}`}
              >
                {/* Preview Header */}
                <div className="flex items-center justify-between pb-4 border-b">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded"
                      style={{ backgroundColor: settings.primaryColor }}
                    />
                    <span className="font-bold text-lg">{settings.appName}</span>
                  </div>
                </div>

                {/* Preview Content */}
                <div className="space-y-3">
                  <div
                    className="h-10 rounded-lg"
                    style={{ backgroundColor: settings.primaryColor }}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <div
                      className="h-20 rounded-lg"
                      style={{ backgroundColor: settings.secondaryColor }}
                    />
                    <div
                      className="h-20 rounded-lg"
                      style={{ backgroundColor: settings.accentColor }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-center pt-2">
                    Preview of your customized platform
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Color Palette Display */}
          <Card>
            <CardHeader>
              <CardTitle>Color Palette</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded border"
                      style={{ backgroundColor: settings.primaryColor }}
                    />
                    <div>
                      <p className="font-medium text-sm">Primary</p>
                      <p className="text-xs text-muted-foreground">{settings.primaryColor}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded border"
                      style={{ backgroundColor: settings.secondaryColor }}
                    />
                    <div>
                      <p className="font-medium text-sm">Secondary</p>
                      <p className="text-xs text-muted-foreground">{settings.secondaryColor}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded border"
                      style={{ backgroundColor: settings.accentColor }}
                    />
                    <div>
                      <p className="font-medium text-sm">Accent</p>
                      <p className="text-xs text-muted-foreground">{settings.accentColor}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={handleReset}>
          Reset to Default
        </Button>
        <Button onClick={handleSave} className="bg-brand-blue hover:bg-brand-blue/90">
          Save Branding Settings
        </Button>
      </div>
    </div>
  );
}

export default TenantBranding;
