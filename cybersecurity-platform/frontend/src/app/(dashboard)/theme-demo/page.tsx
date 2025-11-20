'use client';

import { BrandColorPicker } from '@/components/shared/BrandColorPicker';
import { Header } from '@/components/shared/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/lib/theme/theme-provider';

export default function ThemeDemoPage() {
  const { resolvedTheme, brandColors } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto max-w-6xl space-y-8 py-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Theme & Branding Demo</h1>
          <p className="text-muted-foreground">
            Test the dynamic theming system with light/dark mode and custom brand colors.
          </p>
        </div>

        {/* Current Theme Info */}
        <Card>
          <CardHeader>
            <CardTitle>Current Theme</CardTitle>
            <CardDescription>Active theme and brand colors</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <span className="font-semibold">Mode:</span>{' '}
              <span className="capitalize">{resolvedTheme}</span>
            </p>
            <p>
              <span className="font-semibold">Primary Color:</span>{' '}
              <span className="font-mono">{brandColors.primary}</span>
              <span
                className="ml-2 inline-block h-4 w-4 rounded border"
                style={{ backgroundColor: brandColors.primary }}
              />
            </p>
            <p>
              <span className="font-semibold">Secondary Color:</span>{' '}
              <span className="font-mono">{brandColors.secondary}</span>
              <span
                className="ml-2 inline-block h-4 w-4 rounded border"
                style={{ backgroundColor: brandColors.secondary }}
              />
            </p>
          </CardContent>
        </Card>

        {/* Brand Color Picker */}
        <BrandColorPicker />

        {/* Component Showcase */}
        <Card>
          <CardHeader>
            <CardTitle>Component Showcase</CardTitle>
            <CardDescription>See how components adapt to theme changes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Buttons */}
            <div className="space-y-3">
              <h3 className="font-semibold">Buttons</h3>
              <div className="flex flex-wrap gap-3">
                <Button>Primary Button</Button>
                <Button variant="outline">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>

            {/* Cards */}
            <div className="space-y-3">
              <h3 className="font-semibold">Cards</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Card Title</CardTitle>
                    <CardDescription>Card description</CardDescription>
                  </CardHeader>
                  <CardContent>Card content goes here</CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Another Card</CardTitle>
                    <CardDescription>With more content</CardDescription>
                  </CardHeader>
                  <CardContent>More content</CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Third Card</CardTitle>
                    <CardDescription>Last one</CardDescription>
                  </CardHeader>
                  <CardContent>Final content</CardContent>
                </Card>
              </div>
            </div>

            {/* Text Variations */}
            <div className="space-y-3">
              <h3 className="font-semibold">Typography</h3>
              <div className="space-y-2">
                <h1 className="text-4xl font-bold">Heading 1</h1>
                <h2 className="text-3xl font-bold">Heading 2</h2>
                <h3 className="text-2xl font-bold">Heading 3</h3>
                <p className="text-base">
                  Regular paragraph text with <span className="text-primary">primary color</span>{' '}
                  and <span className="text-muted-foreground">muted text</span>.
                </p>
              </div>
            </div>

            {/* Alerts */}
            <div className="space-y-3">
              <h3 className="font-semibold">Alerts</h3>
              <div className="space-y-3">
                <div className="rounded-lg border bg-card p-4">
                  <p className="font-semibold">Info Alert</p>
                  <p className="text-sm text-muted-foreground">This is an informational message.</p>
                </div>
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                  <p className="font-semibold text-destructive">Error Alert</p>
                  <p className="text-sm text-destructive">Something went wrong!</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>How to Use</CardTitle>
            <CardDescription>Integrate theming in your components</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="mb-2 font-semibold">1. Import the theme hook</h4>
              <pre className="rounded-lg bg-muted p-4 text-sm">
                <code>{`import { useTheme } from '@/lib/theme/theme-provider';`}</code>
              </pre>
            </div>
            <div>
              <h4 className="mb-2 font-semibold">2. Use in your component</h4>
              <pre className="rounded-lg bg-muted p-4 text-sm">
                <code>{`const { theme, setTheme, brandColors, setBrandColors } = useTheme();`}</code>
              </pre>
            </div>
            <div>
              <h4 className="mb-2 font-semibold">3. Apply tenant branding</h4>
              <pre className="rounded-lg bg-muted p-4 text-sm">
                <code>{`import { useTenantBranding } from '@/hooks/useTenantBranding';

const { logo, primaryColor, secondaryColor } = useTenantBranding();`}</code>
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
