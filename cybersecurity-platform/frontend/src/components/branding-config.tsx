'use client';

import { Check, Image as ImageIcon, Palette, Save, Upload, X } from 'lucide-react';
import { useState } from 'react';

interface BrandingConfig {
  companyName: string;
  logoUrl: string;
  faviconUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: 'inter' | 'roboto' | 'opensans' | 'poppins';
  customCss?: string;
}

interface BrandingConfigPanelProps {
  onSave?: (config: BrandingConfig) => void;
  className?: string;
}

export function BrandingConfigPanel({ onSave, className = '' }: BrandingConfigPanelProps) {
  const [config, setConfig] = useState<BrandingConfig>({
    companyName: 'SA Government Cybersecurity',
    logoUrl: '/logo.svg',
    faviconUrl: '/favicon.ico',
    primaryColor: '#0066CC',
    secondaryColor: '#10B981',
    accentColor: '#8B5CF6',
    fontFamily: 'inter',
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const fontOptions = [
    { value: 'inter', label: 'Inter', preview: 'font-sans' },
    { value: 'roboto', label: 'Roboto', preview: 'font-roboto' },
    { value: 'opensans', label: 'Open Sans', preview: 'font-opensans' },
    { value: 'poppins', label: 'Poppins', preview: 'font-poppins' },
  ];

  const colorPresets = [
    { name: 'Government Blue', primary: '#0066CC', secondary: '#10B981', accent: '#F59E0B' },
    { name: 'Corporate', primary: '#1E3A8A', secondary: '#059669', accent: '#DC2626' },
    { name: 'Modern Purple', primary: '#7C3AED', secondary: '#06B6D4', accent: '#F59E0B' },
    { name: 'Professional Gray', primary: '#374151', secondary: '#10B981', accent: '#F97316' },
  ];

  const handleSave = () => {
    onSave?.(config);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);

    // Apply branding to document
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--brand-primary', config.primaryColor);
      document.documentElement.style.setProperty('--brand-secondary', config.secondaryColor);
      document.documentElement.style.setProperty('--brand-accent', config.accentColor);
    }
  };

  const applyPreset = (preset: typeof colorPresets[0]) => {
    setConfig({
      ...config,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      accentColor: preset.accent,
    });
  };

  const handleFileUpload = (type: 'logo' | 'favicon') => {
    // In production, this would upload to CDN
    alert(`Upload ${type} - would integrate with file upload service`);
  };

  return (
    <div className={`rounded-lg border bg-card ${className}`}>
      <div className="border-b p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-purple-500/10 p-3">
              <Palette className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Custom Branding & White-Labeling</h3>
              <p className="text-sm text-muted-foreground">
                Customize the platform to match your organization's brand
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-accent transition-colors"
            >
              <ImageIcon className="h-4 w-4" />
              <span className="text-sm font-medium">{previewMode ? 'Edit' : 'Preview'}</span>
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 rounded-lg bg-brand-blue px-4 py-2 text-white hover:bg-brand-blue/90 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span className="text-sm font-medium">Save Branding</span>
            </button>
          </div>
        </div>

        {showSuccess && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-brand-green/10 border border-brand-green/20 px-4 py-3">
            <Check className="h-5 w-5 text-brand-green" />
            <p className="text-sm font-medium text-brand-green">Branding updated successfully!</p>
          </div>
        )}
      </div>

      <div className="p-6 space-y-8">
        {/* Company Information */}
        <div>
          <h4 className="font-semibold mb-4">Company Information</h4>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-2">Company Name</label>
              <input
                type="text"
                value={config.companyName}
                onChange={(e) => setConfig({ ...config, companyName: e.target.value })}
                className="w-full rounded-lg border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                placeholder="Your Company Name"
              />
            </div>
          </div>
        </div>

        {/* Logos */}
        <div>
          <h4 className="font-semibold mb-4">Logos & Icons</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-lg border p-4">
              <label className="text-sm font-medium block mb-3">Logo (Light Background)</label>
              <div className="aspect-video rounded-lg bg-white border-2 border-dashed flex items-center justify-center mb-3">
                {config.logoUrl ? (
                  <img
                    src={config.logoUrl}
                    alt="Logo preview"
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <ImageIcon className="h-12 w-12 text-muted-foreground" />
                )}
              </div>
              <button
                onClick={() => handleFileUpload('logo')}
                className="w-full flex items-center justify-center gap-2 rounded-lg border px-4 py-2 hover:bg-accent transition-colors"
              >
                <Upload className="h-4 w-4" />
                <span className="text-sm font-medium">Upload Logo</span>
              </button>
            </div>

            <div className="rounded-lg border p-4">
              <label className="text-sm font-medium block mb-3">Favicon</label>
              <div className="aspect-square rounded-lg bg-white border-2 border-dashed flex items-center justify-center mb-3 max-w-[120px]">
                {config.faviconUrl ? (
                  <img
                    src={config.faviconUrl}
                    alt="Favicon preview"
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <button
                onClick={() => handleFileUpload('favicon')}
                className="w-full flex items-center justify-center gap-2 rounded-lg border px-4 py-2 hover:bg-accent transition-colors"
              >
                <Upload className="h-4 w-4" />
                <span className="text-sm font-medium">Upload Favicon</span>
              </button>
            </div>
          </div>
        </div>

        {/* Color Scheme */}
        <div>
          <h4 className="font-semibold mb-4">Color Scheme</h4>

          {/* Color Presets */}
          <div className="mb-4">
            <label className="text-sm font-medium block mb-2">Quick Presets</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {colorPresets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  className="rounded-lg border p-3 hover:bg-accent transition-colors text-left"
                >
                  <div className="flex gap-1 mb-2">
                    <div
                      className="h-6 w-6 rounded"
                      style={{ backgroundColor: preset.primary }}
                    />
                    <div
                      className="h-6 w-6 rounded"
                      style={{ backgroundColor: preset.secondary }}
                    />
                    <div
                      className="h-6 w-6 rounded"
                      style={{ backgroundColor: preset.accent }}
                    />
                  </div>
                  <p className="text-xs font-medium">{preset.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Colors */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium block mb-2">Primary Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={config.primaryColor}
                  onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                  className="h-10 w-16 rounded border cursor-pointer"
                />
                <input
                  type="text"
                  value={config.primaryColor}
                  onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                  className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">Secondary Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={config.secondaryColor}
                  onChange={(e) => setConfig({ ...config, secondaryColor: e.target.value })}
                  className="h-10 w-16 rounded border cursor-pointer"
                />
                <input
                  type="text"
                  value={config.secondaryColor}
                  onChange={(e) => setConfig({ ...config, secondaryColor: e.target.value })}
                  className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">Accent Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={config.accentColor}
                  onChange={(e) => setConfig({ ...config, accentColor: e.target.value })}
                  className="h-10 w-16 rounded border cursor-pointer"
                />
                <input
                  type="text"
                  value={config.accentColor}
                  onChange={(e) => setConfig({ ...config, accentColor: e.target.value })}
                  className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Typography */}
        <div>
          <h4 className="font-semibold mb-4">Typography</h4>
          <div className="grid md:grid-cols-2 gap-4">
            {fontOptions.map((font) => (
              <button
                key={font.value}
                onClick={() => setConfig({ ...config, fontFamily: font.value as any })}
                className={`rounded-lg border p-4 text-left transition-all hover:bg-accent ${
                  config.fontFamily === font.value ? 'ring-2 ring-brand-blue bg-brand-blue/5' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold">{font.label}</p>
                  {config.fontFamily === font.value && (
                    <div className="rounded-full bg-brand-blue p-1">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
                <p className={`text-sm text-muted-foreground ${font.preview}`}>
                  The quick brown fox jumps over the lazy dog
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Preview Section */}
        {previewMode && (
          <div className="rounded-lg border p-6 bg-muted/30">
            <h4 className="font-semibold mb-4">Live Preview</h4>
            <div
              className="rounded-lg border bg-white p-6 space-y-4"
              style={{
                fontFamily: config.fontFamily,
              }}
            >
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-2" style={{ color: config.primaryColor }}>
                  {config.companyName}
                </h1>
                <p className="text-sm text-gray-600">Security Dashboard Preview</p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div
                  className="rounded-lg p-4 text-white text-center"
                  style={{ backgroundColor: config.primaryColor }}
                >
                  <p className="text-sm font-medium">Primary</p>
                </div>
                <div
                  className="rounded-lg p-4 text-white text-center"
                  style={{ backgroundColor: config.secondaryColor }}
                >
                  <p className="text-sm font-medium">Secondary</p>
                </div>
                <div
                  className="rounded-lg p-4 text-white text-center"
                  style={{ backgroundColor: config.accentColor }}
                >
                  <p className="text-sm font-medium">Accent</p>
                </div>
              </div>

              <button
                className="w-full rounded-lg py-2 text-white font-medium"
                style={{ backgroundColor: config.primaryColor }}
              >
                Sample Button
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
