'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertCircle,
  Check,
  Eye,
  Image as ImageIcon,
  Palette,
  RefreshCw,
  Upload,
  X,
} from 'lucide-react';
import { useState } from 'react';

interface BrandingSettings {
  companyName: string;
  logoUrl: string;
  emailLogoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  emailHeaderColor: string;
  emailFooterText: string;
  certificateHeaderText: string;
  certificateFooterText: string;
  customCss: string;
}

export default function BrandingSettingsPage() {
  const [hasAccess] = useState(true); // Replace with actual feature gate check
  const [subscriptionPlan] = useState('PROFESSIONAL'); // Replace with actual subscription check
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const [settings, setSettings] = useState<BrandingSettings>({
    companyName: 'Acme Corporation',
    logoUrl: '',
    emailLogoUrl: '',
    primaryColor: '#3B8EDE',
    secondaryColor: '#8CB841',
    accentColor: '#E86A33',
    emailHeaderColor: '#1F2937',
    emailFooterText:
      'This email was sent by {{company_name}}. If you have any questions, please contact support@company.com',
    certificateHeaderText: '{{company_name}} certifies that',
    certificateFooterText: 'Valid certificate issued on {{issue_date}}',
    customCss: '',
  });

  const defaultSettings: BrandingSettings = {
    companyName: 'Acme Corporation',
    logoUrl: '',
    emailLogoUrl: '',
    primaryColor: '#3B8EDE',
    secondaryColor: '#8CB841',
    accentColor: '#E86A33',
    emailHeaderColor: '#1F2937',
    emailFooterText:
      'This email was sent by {{company_name}}. If you have any questions, please contact support@company.com',
    certificateHeaderText: '{{company_name}} certifies that',
    certificateFooterText: 'Valid certificate issued on {{issue_date}}',
    customCss: '',
  };

  const handleInputChange = (field: keyof BrandingSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleFileUpload = (field: 'logoUrl' | 'emailLogoUrl', file: File) => {
    // Simulate file upload - replace with actual upload logic
    const reader = new FileReader();
    reader.onloadend = () => {
      handleInputChange(field, reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSaving(false);
    setHasChanges(false);
    // Show success toast
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    setHasChanges(false);
  };

  const handleResetColor = (field: keyof BrandingSettings) => {
    handleInputChange(field, defaultSettings[field]);
  };

  if (!hasAccess) {
    return (
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Palette className="h-8 w-8 text-brand-blue" />
            <h1 className="text-3xl font-bold">Branding & Customization</h1>
          </div>
          <p className="text-muted-foreground">Customize your platform appearance and branding</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Upgrade Required</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Custom branding and white-labeling is available on the Professional and Enterprise
                plans.
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline">Learn More</Button>
                <Button className="bg-brand-blue hover:bg-brand-blue/90">Upgrade Now</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Palette className="h-8 w-8 text-brand-blue" />
            <h1 className="text-3xl font-bold">Branding & Customization</h1>
          </div>
          <p className="text-muted-foreground">Customize your platform appearance and branding</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="success" badgeStyle="solid">
            {subscriptionPlan}
          </Badge>
        </div>
      </div>

      {/* Unsaved Changes Warning */}
      {hasChanges && (
        <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <p className="text-sm font-medium text-yellow-600">
                You have unsaved changes. Make sure to save your changes before leaving this page.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>Basic company details displayed across the platform</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={settings.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                placeholder="Enter company name"
              />
              <p className="text-xs text-muted-foreground">
                This name will appear on certificates, emails, and throughout the platform
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logo Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Logos</CardTitle>
          <CardDescription>Upload your company logos for various uses</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Main Logo */}
          <div className="space-y-3">
            <Label>Platform Logo</Label>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                {settings.logoUrl ? (
                  <div className="space-y-3">
                    <img
                      src={settings.logoUrl}
                      alt="Company logo"
                      className="max-h-24 mx-auto object-contain"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleInputChange('logoUrl', '')}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto" />
                    <div>
                      <Label
                        htmlFor="logo-upload"
                        className="cursor-pointer text-brand-blue hover:underline"
                      >
                        Click to upload
                      </Label>
                      <Input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload('logoUrl', file);
                        }}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG, SVG up to 2MB
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="text-sm text-muted-foreground space-y-2">
                <p className="font-medium">Where it appears:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Platform header/navigation</li>
                  <li>Login and registration pages</li>
                  <li>Mobile applications</li>
                </ul>
                <p className="text-xs pt-2">
                  Recommended size: 200x60px (transparent background)
                </p>
              </div>
            </div>
          </div>

          {/* Email Logo */}
          <div className="space-y-3">
            <Label>Email Header Logo</Label>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                {settings.emailLogoUrl ? (
                  <div className="space-y-3">
                    <img
                      src={settings.emailLogoUrl}
                      alt="Email logo"
                      className="max-h-24 mx-auto object-contain"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleInputChange('emailLogoUrl', '')}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto" />
                    <div>
                      <Label
                        htmlFor="email-logo-upload"
                        className="cursor-pointer text-brand-blue hover:underline"
                      >
                        Click to upload
                      </Label>
                      <Input
                        id="email-logo-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload('emailLogoUrl', file);
                        }}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG up to 1MB
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="text-sm text-muted-foreground space-y-2">
                <p className="font-medium">Where it appears:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Email notifications</li>
                  <li>Course completion emails</li>
                  <li>Certificate delivery emails</li>
                </ul>
                <p className="text-xs pt-2">Recommended size: 600x120px</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Color Scheme */}
      <Card>
        <CardHeader>
          <CardTitle>Color Scheme</CardTitle>
          <CardDescription>Customize the color palette for your platform</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Primary Color */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleResetColor('primaryColor')}
                >
                  <RefreshCw className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex gap-2">
                <Input
                  id="primaryColor"
                  type="color"
                  value={settings.primaryColor}
                  onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                  className="w-20 h-10 cursor-pointer"
                />
                <Input
                  value={settings.primaryColor}
                  onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                  placeholder="#000000"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Used for buttons, links, and primary UI elements
              </p>
            </div>

            {/* Secondary Color */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleResetColor('secondaryColor')}
                >
                  <RefreshCw className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex gap-2">
                <Input
                  id="secondaryColor"
                  type="color"
                  value={settings.secondaryColor}
                  onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                  className="w-20 h-10 cursor-pointer"
                />
                <Input
                  value={settings.secondaryColor}
                  onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                  placeholder="#000000"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Used for success states and highlights
              </p>
            </div>

            {/* Accent Color */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="accentColor">Accent Color</Label>
                <Button variant="ghost" size="sm" onClick={() => handleResetColor('accentColor')}>
                  <RefreshCw className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex gap-2">
                <Input
                  id="accentColor"
                  type="color"
                  value={settings.accentColor}
                  onChange={(e) => handleInputChange('accentColor', e.target.value)}
                  className="w-20 h-10 cursor-pointer"
                />
                <Input
                  value={settings.accentColor}
                  onChange={(e) => handleInputChange('accentColor', e.target.value)}
                  placeholder="#000000"
                />
              </div>
              <p className="text-xs text-muted-foreground">Used for warnings and call-to-actions</p>
            </div>

            {/* Email Header Color */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="emailHeaderColor">Email Header Color</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleResetColor('emailHeaderColor')}
                >
                  <RefreshCw className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex gap-2">
                <Input
                  id="emailHeaderColor"
                  type="color"
                  value={settings.emailHeaderColor}
                  onChange={(e) => handleInputChange('emailHeaderColor', e.target.value)}
                  className="w-20 h-10 cursor-pointer"
                />
                <Input
                  value={settings.emailHeaderColor}
                  onChange={(e) => handleInputChange('emailHeaderColor', e.target.value)}
                  placeholder="#000000"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Background color for email headers
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Email Templates</CardTitle>
          <CardDescription>
            Customize email footer text. Available variables: {'{'}
            {'{'}company_name{'}}'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="emailFooterText">Email Footer Text</Label>
            <Textarea
              id="emailFooterText"
              value={settings.emailFooterText}
              onChange={(e) => handleInputChange('emailFooterText', e.target.value)}
              rows={3}
              placeholder="Enter email footer text..."
            />
            <p className="text-xs text-muted-foreground">
              This text appears at the bottom of all system emails
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Certificate Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Certificate Templates</CardTitle>
          <CardDescription>
            Customize certificate text. Available variables: {'{'}
            {'{'}company_name{'}}'},{'{'} {'{'}issue_date{'}}'},{'{'} {'{'}user_name{'}}'},{'{'}{' '}
            {'{'}course_name{'}}'}, {'{'} {'{'}completion_date{'}}'},{' '}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="certificateHeaderText">Certificate Header Text</Label>
            <Textarea
              id="certificateHeaderText"
              value={settings.certificateHeaderText}
              onChange={(e) => handleInputChange('certificateHeaderText', e.target.value)}
              rows={2}
              placeholder="Enter certificate header text..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="certificateFooterText">Certificate Footer Text</Label>
            <Textarea
              id="certificateFooterText"
              value={settings.certificateFooterText}
              onChange={(e) => handleInputChange('certificateFooterText', e.target.value)}
              rows={2}
              placeholder="Enter certificate footer text..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Advanced Customization */}
      <Card>
        <CardHeader>
          <CardTitle>Advanced Customization</CardTitle>
          <CardDescription>
            Add custom CSS to further customize your platform appearance (Enterprise only)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customCss">Custom CSS</Label>
            <Textarea
              id="customCss"
              value={settings.customCss}
              onChange={(e) => handleInputChange('customCss', e.target.value)}
              rows={6}
              placeholder="/* Enter custom CSS rules */"
              className="font-mono text-sm"
              disabled={subscriptionPlan !== 'ENTERPRISE'}
            />
            {subscriptionPlan !== 'ENTERPRISE' && (
              <p className="text-xs text-yellow-600 flex items-center gap-2">
                <AlertCircle className="h-3 w-3" />
                Custom CSS is only available on Enterprise plan
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-4 sticky bottom-0 bg-background py-4 border-t">
        <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
          <Eye className="mr-2 h-4 w-4" />
          {showPreview ? 'Hide Preview' : 'Preview Changes'}
        </Button>

        <div className="flex gap-3">
          <Button variant="outline" onClick={handleReset} disabled={!hasChanges}>
            Reset to Default
          </Button>
          <Button
            className="bg-brand-blue hover:bg-brand-blue/90"
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
          >
            {isSaving ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Preview Modal/Section - Simple implementation */}
      {showPreview && (
        <Card className="border-2 border-brand-blue">
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>See how your branding will look</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Logo Preview */}
              <div className="p-6 border rounded-lg">
                <p className="text-xs text-muted-foreground mb-3">Platform Header</p>
                <div
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: settings.primaryColor + '10' }}
                >
                  {settings.logoUrl ? (
                    <img src={settings.logoUrl} alt="Logo preview" className="h-12" />
                  ) : (
                    <div className="h-12 flex items-center font-bold text-xl">
                      {settings.companyName}
                    </div>
                  )}
                </div>
              </div>

              {/* Color Scheme Preview */}
              <div className="p-6 border rounded-lg">
                <p className="text-xs text-muted-foreground mb-3">Color Scheme</p>
                <div className="flex gap-4">
                  <div className="flex-1 space-y-2">
                    <div
                      className="h-16 rounded-lg"
                      style={{ backgroundColor: settings.primaryColor }}
                    />
                    <p className="text-xs text-center">Primary</p>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div
                      className="h-16 rounded-lg"
                      style={{ backgroundColor: settings.secondaryColor }}
                    />
                    <p className="text-xs text-center">Secondary</p>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div
                      className="h-16 rounded-lg"
                      style={{ backgroundColor: settings.accentColor }}
                    />
                    <p className="text-xs text-center">Accent</p>
                  </div>
                </div>
              </div>

              {/* Button Preview */}
              <div className="p-6 border rounded-lg">
                <p className="text-xs text-muted-foreground mb-3">UI Elements</p>
                <div className="flex gap-3 flex-wrap">
                  <button
                    className="px-4 py-2 rounded-md text-white font-medium"
                    style={{ backgroundColor: settings.primaryColor }}
                  >
                    Primary Button
                  </button>
                  <button
                    className="px-4 py-2 rounded-md text-white font-medium"
                    style={{ backgroundColor: settings.secondaryColor }}
                  >
                    Secondary Button
                  </button>
                  <button
                    className="px-4 py-2 rounded-md text-white font-medium"
                    style={{ backgroundColor: settings.accentColor }}
                  >
                    Accent Button
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
