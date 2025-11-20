'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Download } from 'lucide-react';

export default function CertificatesPage() {
  // Mock data
  const certificates = [
    {
      id: 1,
      title: 'Phishing Awareness Certification',
      course: 'Phishing Awareness Training',
      earnedDate: '2024-12-01',
      expiryDate: '2025-12-01',
      score: 95,
    },
    {
      id: 2,
      title: 'Password Security Expert',
      course: 'Password Security Best Practices',
      earnedDate: '2024-11-15',
      expiryDate: '2025-11-15',
      score: 92,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Certificates</h1>
        <p className="text-muted-foreground">View and download your earned certificates</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {certificates.map((cert) => (
          <Card key={cert.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="rounded-full bg-brand-green/10 p-3">
                    <Award className="h-6 w-6 text-brand-green" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{cert.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{cert.course}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Earned Date</span>
                  <span className="font-medium">
                    {new Date(cert.earnedDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Expiry Date</span>
                  <span className="font-medium">
                    {new Date(cert.expiryDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Score</span>
                  <Badge variant="success">{cert.score}%</Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button variant="outline">View</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
