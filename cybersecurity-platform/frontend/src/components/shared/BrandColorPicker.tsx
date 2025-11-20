'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/lib/theme/theme-provider';
import { useState } from 'react';

export function BrandColorPicker() {
  const { brandColors, setBrandColors } = useTheme();
  const [primaryColor, setPrimaryColor] = useState(brandColors.primary);
  const [secondaryColor, setSecondaryColor] = useState(brandColors.secondary);

  const handleApply = () => {
    setBrandColors({
      primary: primaryColor,
      secondary: secondaryColor,
    });
  };

  const handleReset = () => {
    const defaultColors = {
      primary: '#3B82F6',
      secondary: '#1E40AF',
    };
    setPrimaryColor(defaultColors.primary);
    setSecondaryColor(defaultColors.secondary);
    setBrandColors(defaultColors);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Brand Colors</CardTitle>
        <CardDescription>Customize your organization's brand colors</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="primary-color">Primary Color</Label>
          <div className="flex gap-2">
            <Input
              id="primary-color"
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="h-10 w-20 cursor-pointer"
            />
            <Input
              type="text"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              placeholder="#3B82F6"
              className="flex-1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="secondary-color">Secondary Color</Label>
          <div className="flex gap-2">
            <Input
              id="secondary-color"
              type="color"
              value={secondaryColor}
              onChange={(e) => setSecondaryColor(e.target.value)}
              className="h-10 w-20 cursor-pointer"
            />
            <Input
              type="text"
              value={secondaryColor}
              onChange={(e) => setSecondaryColor(e.target.value)}
              placeholder="#1E40AF"
              className="flex-1"
            />
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button onClick={handleApply} className="flex-1">
            Apply Colors
          </Button>
          <Button onClick={handleReset} variant="outline">
            Reset to Default
          </Button>
        </div>

        {/* Preview */}
        <div className="mt-6 space-y-3">
          <Label>Preview</Label>
          <div className="flex gap-2">
            <div
              className="h-12 flex-1 rounded-md border"
              style={{ backgroundColor: primaryColor }}
            />
            <div
              className="h-12 flex-1 rounded-md border"
              style={{ backgroundColor: secondaryColor }}
            />
          </div>
          <div className="flex gap-2">
            <Button style={{ backgroundColor: primaryColor }} className="flex-1">
              Primary Button
            </Button>
            <Button style={{ backgroundColor: secondaryColor }} className="flex-1">
              Secondary Button
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
