import Image from 'next/image';
import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div
        className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-between relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #3B8EDE 0%, #8CB841 50%, #E86A33 100%)',
        }}
      >
        {/* Decorative overlay */}
        <div className="absolute inset-0 bg-black/10" />

        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-8">
            <div className="relative h-12 w-12 bg-white rounded-lg p-2">
              <Image
                src="/images/swiiff-icon.png"
                alt="SWIIFF"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
            <span className="text-white text-2xl font-bold">CyberSecurity Platform</span>
          </div>
        </div>

        <div className="space-y-6 text-white relative z-10">
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

        <div className="flex items-center space-x-6 text-white/90 text-sm relative z-10">
          <div className="flex space-x-2">
            <div
              className="h-3 w-3 rounded-full border-2 border-white"
              style={{ backgroundColor: '#F5C242' }}
            />
            <div
              className="h-3 w-3 rounded-full border-2 border-white"
              style={{ backgroundColor: '#E86A33' }}
            />
            <div
              className="h-3 w-3 rounded-full border-2 border-white"
              style={{ backgroundColor: '#3B8EDE' }}
            />
            <div
              className="h-3 w-3 rounded-full border-2 border-white"
              style={{ backgroundColor: '#8CB841' }}
            />
          </div>
          <span className="font-medium">© 2025 SWIIFF Security • CyberSecurity Platform</span>
        </div>
      </div>

      {/* Right side - Auth forms */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 flex justify-center">
            <div className="flex items-center space-x-3">
              <div
                className="relative h-10 w-10 rounded-lg p-2"
                style={{ backgroundColor: '#3B8EDE' }}
              >
                <Image
                  src="/images/swiiff-icon.png"
                  alt="SWIIFF"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              <span className="text-xl font-bold">CyberSecurity Platform</span>
            </div>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
