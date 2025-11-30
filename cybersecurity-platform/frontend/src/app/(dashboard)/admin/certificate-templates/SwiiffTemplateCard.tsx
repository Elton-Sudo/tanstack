'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SwiiffCertificateTemplate, {
  CertificateData,
} from '@/components/certificates/SwiiffCertificateTemplate';
import { Award, Check, Copy, Edit, Eye, Star, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface SwiiffTemplateCardProps {
  onEdit?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
}

export default function SwiiffTemplateCard({
  onEdit,
  onDuplicate,
  onDelete,
}: SwiiffTemplateCardProps) {
  const [showPreview, setShowPreview] = useState(false);

  const sampleData: CertificateData = {
    recipientName: 'John Doe',
    courseName: 'Cybersecurity Fundamentals',
    completionDate: new Date().toISOString(),
    score: 95,
    certificateNumber: 'CERT-SWIIFF-2024-001',
    instructor: 'Dr. Sarah Chen',
    duration: '2.5 hours',
    tenantName: 'SWIIFF Security Platform',
  };

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow border-2 border-brand-blue/20">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-r from-brand-blue/10 to-brand-green/10">
                <Award className="h-5 w-5 text-brand-blue" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">SWIIFF Default Certificate</CardTitle>
                  <Badge variant="success" badgeStyle="solid">
                    <Star className="mr-1 h-3 w-3" />
                    Default
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Official SWIIFF-branded certificate template
                </p>
              </div>
            </div>
            <Badge variant="primary" badgeStyle="outline">
              <Check className="mr-1 h-3 w-3" />
              Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Template Preview */}
          <div className="aspect-video rounded-lg border-2 border-dashed border-brand-blue/30 overflow-hidden bg-gradient-to-br from-white to-gray-50 relative">
            <div className="absolute inset-0 flex items-center justify-center p-2">
              <div className="transform scale-[0.18] origin-center w-[555%] h-[555%] -mt-[225%] -ml-[225%]">
                <SwiiffCertificateTemplate data={sampleData} variant="preview" />
              </div>
            </div>
            {/* Overlay to indicate it's a preview */}
            <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 rounded text-xs text-gray-600 font-medium">
              Live Preview
            </div>
          </div>

          {/* Template Info */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Orientation:</span>
              <span className="font-medium">Landscape</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Brand Colors:</span>
              <div className="flex gap-1">
                <div className="w-6 h-6 rounded bg-brand-blue border" title="Primary" />
                <div className="w-6 h-6 rounded bg-brand-green border" title="Secondary" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Logo:</span>
              <span className="font-medium text-xs">SWIIFF Official</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Scope:</span>
              <Badge variant="default" badgeStyle="outline" className="text-xs">
                Global
              </Badge>
            </div>
          </div>

          {/* Restricted Access Notice */}
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-xs text-yellow-800 dark:text-yellow-200">
              <strong>Super Admin Only:</strong> This template can only be modified by super
              administrators.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview(true)}
              className="flex-1"
            >
              <Eye className="mr-1 h-4 w-4" />
              Full Preview
            </Button>
            <Button variant="ghost" size="sm" onClick={onEdit} className="flex-1">
              <Edit className="mr-1 h-4 w-4" />
              Edit
            </Button>
            <Button variant="ghost" size="sm" onClick={onDuplicate}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="text-red-600 hover:text-red-700"
              disabled
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Full Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Award className="h-6 w-6 text-brand-blue" />
                  <div>
                    <CardTitle>SWIIFF Certificate Template Preview</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      This is how certificates will appear when generated
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowPreview(false)}>
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 dark:bg-gray-900 p-8 rounded-lg">
                <SwiiffCertificateTemplate data={sampleData} variant="preview" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
