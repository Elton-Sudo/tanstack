'use client';

import { Moon, Sun, Monitor, Palette } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggleAdvanced() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="rounded-lg bg-muted animate-pulse h-10 w-32" />;
  }

  const currentTheme = theme === 'system' ? systemTheme : theme;

  const themes = [
    {
      value: 'light',
      label: 'Light',
      icon: Sun,
      description: 'Clean and bright interface',
      preview: 'bg-white border-gray-200',
    },
    {
      value: 'dark',
      label: 'Dark',
      icon: Moon,
      description: 'Easy on the eyes',
      preview: 'bg-gray-900 border-gray-700',
    },
    {
      value: 'system',
      label: 'System',
      icon: Monitor,
      description: 'Matches your device',
      preview: 'bg-gradient-to-r from-white to-gray-900',
    },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 rounded-lg border bg-card px-4 py-2 hover:bg-accent transition-colors group"
        aria-label="Toggle theme"
      >
        <Palette className="h-4 w-4" />
        <span className="text-sm font-medium capitalize">{currentTheme}</span>
        <div className={`transform transition-transform ${showMenu ? 'rotate-180' : ''}`}>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {showMenu && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
            aria-hidden="true"
          />

          {/* Menu */}
          <div className="absolute right-0 mt-2 w-72 rounded-lg border bg-card shadow-2xl z-50 overflow-hidden">
            <div className="p-4 border-b bg-muted/50">
              <h3 className="font-semibold flex items-center gap-2">
                <Palette className="h-4 w-4 text-brand-blue" />
                Choose Theme
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Select your preferred color scheme
              </p>
            </div>

            <div className="p-2">
              {themes.map((themeOption) => {
                const Icon = themeOption.icon;
                const isActive = theme === themeOption.value;

                return (
                  <button
                    key={themeOption.value}
                    onClick={() => {
                      setTheme(themeOption.value);
                      setShowMenu(false);
                    }}
                    className={`w-full flex items-start gap-3 p-3 rounded-lg transition-all hover:bg-accent ${
                      isActive ? 'bg-brand-blue/10 ring-2 ring-brand-blue/20' : ''
                    }`}
                  >
                    <div
                      className={`rounded-lg p-2 ${
                        isActive ? 'bg-brand-blue text-white' : 'bg-muted'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-sm">{themeOption.label}</p>
                      <p className="text-xs text-muted-foreground">{themeOption.description}</p>
                    </div>
                    {isActive && (
                      <div className="rounded-full bg-brand-blue p-1">
                        <svg
                          className="h-3 w-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="p-4 border-t bg-muted/30">
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold">Tip:</span> System theme automatically switches
                based on your device settings
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Simple inline theme toggle for navbars
export function ThemeToggleSimple() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="rounded-lg p-2 hover:bg-accent transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
