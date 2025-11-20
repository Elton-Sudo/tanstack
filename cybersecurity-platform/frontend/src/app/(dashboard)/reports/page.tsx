'use client';

import { FileText, Download, Calendar, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ReportsPage() {
  // Mock data
  const reports = [
    {
      id: 1,
      title: 'Q4 2024 Security Training Report',
      type: 'Training',
      date: '2024-12-15',
      status: 'completed',
    },
    {
      id: 2,
      title: 'Risk Assessment Summary',
      type: 'Risk',
      date: '2024-12-10',
      status: 'completed',
    },
    {
      id: 3,
      title: 'Compliance Audit Report',
      type: 'Compliance',
      date: '2024-12-05',
      status: 'completed',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground">
            Generate and download compliance and training reports
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Link href="/reports/builder">
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              Create Report
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4">
        {reports.map((report) => (
          <Card key={report.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="rounded-full bg-brand-blue/10 p-3">
                    <FileText className="h-6 w-6 text-brand-blue" />
                  </div>
                  <div>
                    <CardTitle>{report.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(report.date).toLocaleDateString()}</span>
                      <Badge variant="info">{report.type}</Badge>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
