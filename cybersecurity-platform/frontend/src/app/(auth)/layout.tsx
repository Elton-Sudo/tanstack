import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-blue via-brand-green to-brand-orange p-12 flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-8">
            <div className="flex space-x-1">
              <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center text-brand-blue font-bold text-xl">
                C
              </div>
            </div>
            <span className="text-white text-2xl font-bold">CyberSec Platform</span>
          </div>
        </div>

        <div className="space-y-6 text-white">
          <h1 className="text-4xl font-bold leading-tight">
            Empower Your Team with Cybersecurity Excellence
          </h1>
          <p className="text-lg text-white/90">
            Comprehensive training, real-time risk assessment, and compliance tracking all in one
            platform.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-8">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                  1
                </div>
                <span className="text-sm font-medium">Interactive Training</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                  2
                </div>
                <span className="text-sm font-medium">Risk Monitoring</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                  3
                </div>
                <span className="text-sm font-medium">Compliance Reports</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                  4
                </div>
                <span className="text-sm font-medium">Analytics Dashboard</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-6 text-white/80 text-sm">
          <div className="flex space-x-2">
            <div className="h-3 w-3 rounded-full bg-brand-blue border-2 border-white" />
            <div className="h-3 w-3 rounded-full bg-brand-green border-2 border-white" />
            <div className="h-3 w-3 rounded-full bg-brand-orange border-2 border-white" />
            <div className="h-3 w-3 rounded-full bg-brand-red border-2 border-white" />
          </div>
          <span>© 2025 CyberSec Platform</span>
        </div>
      </div>

      {/* Right side - Auth forms */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 flex justify-center">
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-full bg-brand-blue flex items-center justify-center text-white font-bold">
                C
              </div>
              <span className="text-xl font-bold">CyberSec Platform</span>
            </div>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
