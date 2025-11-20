'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function ReportBuilderPage() {
  const [reportName, setReportName] = useState('');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);

  const availableMetrics = [
    { id: 'users', name: 'Active Users', category: 'Users' },
    { id: 'courses', name: 'Course Completions', category: 'Training' },
    { id: 'risk', name: 'Risk Score', category: 'Risk' },
    { id: 'compliance', name: 'Compliance Rate', category: 'Compliance' },
    { id: 'incidents', name: 'Security Incidents', category: 'Security' },
  ];

  const toggleMetric = (metricId: string) => {
    setSelectedMetrics((prev) =>
      prev.includes(metricId) ? prev.filter((id) => id !== metricId) : [...prev, metricId],
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Report Builder</h1>
        <p className="text-muted-foreground">Create a custom report with the metrics you need</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Report Name</label>
            <Input
              placeholder="Enter report name..."
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium">Select Metrics</label>
            <div className="grid gap-2 md:grid-cols-2">
              {availableMetrics.map((metric) => (
                <button
                  key={metric.id}
                  onClick={() => toggleMetric(metric.id)}
                  className={`p-4 rounded-lg border-2 text-left transition-colors ${
                    selectedMetrics.includes(metric.id)
                      ? 'border-brand-blue bg-brand-blue/10'
                      : 'border-border hover:border-brand-blue/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{metric.name}</p>
                      <Badge variant="default" className="mt-1">
                        {metric.category}
                      </Badge>
                    </div>
                    {selectedMetrics.includes(metric.id) ? (
                      <Trash2 className="h-4 w-4 text-brand-red" />
                    ) : (
                      <Plus className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button className="flex-1">Generate Report</Button>
            <Button variant="outline">Save Template</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
