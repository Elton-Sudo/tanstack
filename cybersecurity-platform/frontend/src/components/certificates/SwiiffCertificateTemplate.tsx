'use client';

import { Award, CheckCircle2, Shield } from 'lucide-react';
import Image from 'next/image';
import { formatCertificateDate } from '@/lib/date-utils';

export interface CertificateData {
  recipientName: string;
  courseName: string;
  completionDate: string;
  score?: number;
  certificateNumber: string;
  instructor?: string;
  tenantName?: string;
  duration?: string;
}

interface SwiiffCertificateTemplateProps {
  data: CertificateData;
  variant?: 'default' | 'print' | 'preview';
}

export default function SwiiffCertificateTemplate({
  data,
  variant = 'default',
}: SwiiffCertificateTemplateProps) {
  const isPrint = variant === 'print';
  const isPreview = variant === 'preview';

  return (
    <div
      className={`relative bg-white ${
        isPrint ? 'w-[297mm] h-[210mm]' : 'aspect-[1.414/1]'
      } ${isPreview ? 'shadow-2xl' : ''} overflow-hidden`}
      style={{ printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(45deg, #3B82F6 25%, transparent 25%),
              linear-gradient(-45deg, #3B82F6 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #3B82F6 75%),
              linear-gradient(-45deg, transparent 75%, #3B82F6 75%)
            `,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
          }}
        />
      </div>

      {/* Decorative Border */}
      <div className="absolute inset-0 p-8">
        <div className="h-full w-full border-8 border-brand-blue/20 rounded-lg" />
      </div>
      <div className="absolute inset-0 p-12">
        <div className="h-full w-full border-2 border-brand-blue/30 rounded-lg" />
      </div>

      {/* Decorative Corner Elements */}
      <div className="absolute top-8 left-8 w-24 h-24">
        <div className="absolute inset-0 border-t-4 border-l-4 border-brand-blue rounded-tl-2xl" />
        <Shield className="absolute top-2 left-2 h-8 w-8 text-brand-blue" />
      </div>
      <div className="absolute top-8 right-8 w-24 h-24">
        <div className="absolute inset-0 border-t-4 border-r-4 border-brand-green rounded-tr-2xl" />
        <CheckCircle2 className="absolute top-2 right-2 h-8 w-8 text-brand-green" />
      </div>
      <div className="absolute bottom-8 left-8 w-24 h-24">
        <div className="absolute inset-0 border-b-4 border-l-4 border-brand-blue rounded-bl-2xl" />
      </div>
      <div className="absolute bottom-8 right-8 w-24 h-24">
        <div className="absolute inset-0 border-b-4 border-r-4 border-brand-green rounded-br-2xl" />
      </div>

      {/* Main Content */}
      <div className="relative h-full flex flex-col items-center justify-center p-16 z-10">
        {/* Header with Logo */}
        <div className="flex items-center gap-4 mb-8">
          <div className="relative w-20 h-20">
            <Image
              src="/images/swiiff-logo.png"
              alt="SWIIFF Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="text-left">
            <h1 className="text-3xl font-bold text-brand-blue">SWIIFF</h1>
            <p className="text-sm text-gray-600">Security & Compliance Training</p>
          </div>
        </div>

        {/* Certificate Title */}
        <div className="text-center mb-6">
          <div className="inline-block px-6 py-2 bg-gradient-to-r from-brand-blue/10 to-brand-green/10 rounded-full mb-4">
            <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Certificate of Completion
            </p>
          </div>
        </div>

        {/* Award Icon */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-blue to-brand-green opacity-20 blur-2xl rounded-full" />
            <Award className="relative h-24 w-24 text-brand-blue" strokeWidth={1.5} />
          </div>
        </div>

        {/* Recipient Info */}
        <div className="text-center mb-8 space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">This is to certify that</p>
            <h2 className="text-4xl font-bold text-gray-900 mb-1">{data.recipientName}</h2>
            <div className="h-1 w-64 mx-auto bg-gradient-to-r from-brand-blue via-purple-500 to-brand-green rounded-full" />
          </div>

          <div className="py-4">
            <p className="text-sm text-gray-600 mb-2">has successfully completed</p>
            <h3 className="text-2xl font-semibold text-brand-blue">{data.courseName}</h3>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-3 gap-8 mb-8 w-full max-w-2xl">
          <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-500 uppercase mb-1">Completion Date</p>
            <p className="font-semibold text-gray-900">
              {formatCertificateDate(data.completionDate)}
            </p>
          </div>

          {data.score !== undefined && (
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 uppercase mb-1">Score Achieved</p>
              <p className="font-bold text-2xl text-brand-green">{data.score}%</p>
            </div>
          )}

          {data.duration && (
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 uppercase mb-1">Duration</p>
              <p className="font-semibold text-gray-900">{data.duration}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="w-full max-w-2xl border-t border-gray-200 pt-6 mt-auto">
          <div className="flex items-end justify-between">
            {/* Signature Section */}
            <div className="text-center flex-1">
              <div className="mb-2 h-16 flex items-end justify-center">
                {/* Placeholder for digital signature */}
                <div className="border-t-2 border-gray-400 w-48 pt-2">
                  <p className="text-xs text-gray-600">Authorized Signature</p>
                </div>
              </div>
              {data.instructor && (
                <div>
                  <p className="font-semibold text-gray-900">{data.instructor}</p>
                  <p className="text-xs text-gray-500">Course Instructor</p>
                </div>
              )}
            </div>

            {/* Certificate Details */}
            <div className="text-right flex-1">
              <div className="inline-block text-left p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 uppercase mb-1">Certificate ID</p>
                <p className="font-mono text-sm font-semibold text-gray-900">
                  {data.certificateNumber}
                </p>
              </div>
              <p className="text-xs text-gray-500 mt-2">Verify at: swiiff.com/verify</p>
            </div>
          </div>
        </div>

        {/* Footer Branding */}
        <div className="absolute bottom-6 left-0 right-0 text-center">
          <p className="text-xs text-gray-400">
            {data.tenantName || 'SWIIFF Security Platform'} • Powered by SWIIFF
          </p>
        </div>
      </div>

      {/* Watermark for Preview */}
      {isPreview && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-8xl font-bold text-gray-200 opacity-10 rotate-[-45deg]">PREVIEW</p>
        </div>
      )}
    </div>
  );
}

// Export a simple preview example for testing
export function SwiiffCertificatePreview() {
  const sampleData: CertificateData = {
    recipientName: 'Sarah Johnson',
    courseName: 'Cybersecurity Fundamentals',
    completionDate: new Date().toISOString(),
    score: 95,
    certificateNumber: 'CERT-2024-001-SWIIFF',
    instructor: 'Dr. Michael Chen',
    duration: '2.5 hours',
  };

  return <SwiiffCertificateTemplate data={sampleData} variant="preview" />;
}
