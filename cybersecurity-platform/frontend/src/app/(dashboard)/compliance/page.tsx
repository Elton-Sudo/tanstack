'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle2, Shield } from 'lucide-react';

export default function CompliancePage() {
  // Mock data
  const frameworks = [
    {
      id: 1,
      name: 'GDPR',
      description: 'General Data Protection Regulation',
      compliance: 85,
      status: 'compliant',
      requirements: 12,
      met: 10,
    },
    {
      id: 2,
      name: 'ISO 27001',
      description: 'Information Security Management',
      compliance: 72,
      status: 'in-progress',
      requirements: 15,
      met: 11,
    },
    {
      id: 3,
      name: 'SOC 2',
      description: 'Service Organization Control',
      compliance: 65,
      status: 'at-risk',
      requirements: 10,
      met: 7,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'success';
      case 'in-progress':
        return 'warning';
      case 'at-risk':
        return 'danger';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Compliance Overview</h1>
        <p className="text-muted-foreground">
          Track your organization's compliance with various security frameworks
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Compliant Frameworks</p>
                <p className="text-2xl font-bold">1</p>
              </div>
              <div className="rounded-full bg-brand-green/10 p-3">
                <CheckCircle2 className="h-6 w-6 text-brand-green" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">1</p>
              </div>
              <div className="rounded-full bg-brand-orange/10 p-3">
                <AlertTriangle className="h-6 w-6 text-brand-orange" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">At Risk</p>
                <p className="text-2xl font-bold">1</p>
              </div>
              <div className="rounded-full bg-brand-red/10 p-3">
                <Shield className="h-6 w-6 text-brand-red" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Frameworks */}
      <div className="space-y-4">
        {frameworks.map((framework) => (
          <Card key={framework.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="rounded-full bg-brand-blue/10 p-3">
                    <Shield className="h-6 w-6 text-brand-blue" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle>{framework.name}</CardTitle>
                      <Badge variant={getStatusColor(framework.status) as any}>
                        {framework.status.replace('-', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{framework.description}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {framework.met} of {framework.requirements} requirements met
                </span>
                <span className="font-medium">{framework.compliance}%</span>
              </div>
              <Progress value={framework.compliance} />
              <div className="flex justify-end">
                <button className="text-sm text-brand-blue hover:underline">View Details →</button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
