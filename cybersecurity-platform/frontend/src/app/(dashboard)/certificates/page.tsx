'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MetricCard } from '@/components/visualizations';
import {
  Award,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  Eye,
  Grid3x3,
  List,
  Search,
  Share2,
  Star,
  X,
} from 'lucide-react';
import { useState } from 'react';

interface Certificate {
  id: string;
  title: string;
  courseName: string;
  earnedDate: string;
  expiryDate?: string;
  score: number;
  verificationCode: string;
  duration: string;
  instructor: string;
  category: string;
  status: 'active' | 'expiring_soon' | 'expired';
}

export default function CertificatesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

  // Mock certificates data
  const certificates: Certificate[] = [
    {
      id: '1',
      title: 'Cybersecurity Fundamentals Certificate',
      courseName: 'Cybersecurity Fundamentals',
      earnedDate: '2024-11-01',
      score: 95,
      verificationCode: 'CERT-2024-001-XYZ',
      duration: '2.5 hours',
      instructor: 'Dr. Sarah Chen',
      category: 'Security Fundamentals',
      status: 'active',
    },
    {
      id: '2',
      title: 'Phishing Detection Expert',
      courseName: 'Phishing Detection & Prevention',
      earnedDate: '2024-11-05',
      expiryDate: '2025-11-05',
      score: 92,
      verificationCode: 'CERT-2024-002-ABC',
      duration: '1.5 hours',
      instructor: 'Michael Roberts',
      category: 'Email Security',
      status: 'active',
    },
    {
      id: '3',
      title: 'GDPR Compliance Specialist',
      courseName: 'GDPR Compliance Training',
      earnedDate: '2024-10-20',
      score: 88,
      verificationCode: 'CERT-2024-003-DEF',
      duration: '3 hours',
      instructor: 'Jennifer Lee',
      category: 'Compliance',
      status: 'active',
    },
    {
      id: '4',
      title: 'Password Security Mastery',
      courseName: 'Password Security Best Practices',
      earnedDate: '2024-10-15',
      expiryDate: '2024-12-15',
      score: 100,
      verificationCode: 'CERT-2024-004-GHI',
      duration: '1 hour',
      instructor: 'Dr. Sarah Chen',
      category: 'Authentication',
      status: 'expiring_soon',
    },
    {
      id: '5',
      title: 'Incident Response Basics',
      courseName: 'Incident Response Training',
      earnedDate: '2024-09-20',
      expiryDate: '2024-11-20',
      score: 85,
      verificationCode: 'CERT-2024-005-JKL',
      duration: '2 hours',
      instructor: 'Thomas Brown',
      category: 'Security Operations',
      status: 'expired',
    },
    {
      id: '6',
      title: 'Advanced Threat Detection',
      courseName: 'Advanced Threat Detection Course',
      earnedDate: '2024-11-25',
      score: 94,
      verificationCode: 'CERT-2024-006-MNO',
      duration: '4 hours',
      instructor: 'Dr. Sarah Chen',
      category: 'Advanced Security',
      status: 'active',
    },
    {
      id: '7',
      title: 'Social Engineering Defense',
      courseName: 'Social Engineering Awareness',
      earnedDate: '2024-10-05',
      score: 90,
      verificationCode: 'CERT-2024-007-PQR',
      duration: '2.5 hours',
      instructor: 'Lisa Park',
      category: 'Social Engineering',
      status: 'active',
    },
    {
      id: '8',
      title: 'Data Protection Certificate',
      courseName: 'Data Protection & Privacy',
      earnedDate: '2024-09-10',
      score: 87,
      verificationCode: 'CERT-2024-008-STU',
      duration: '2 hours',
      instructor: 'Jennifer Lee',
      category: 'Compliance',
      status: 'active',
    },
  ];

  const stats = {
    totalCertificates: certificates.length,
    activeCertificates: certificates.filter((c) => c.status === 'active').length,
    expiringSoon: certificates.filter((c) => c.status === 'expiring_soon').length,
    averageScore: (certificates.reduce((sum, c) => sum + c.score, 0) / certificates.length).toFixed(
      1,
    ),
  };

  const filteredCertificates = certificates.filter((cert) => {
    const matchesSearch =
      searchQuery === '' ||
      cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.courseName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && cert.status === 'active') ||
      (statusFilter === 'expiring' && cert.status === 'expiring_soon') ||
      (statusFilter === 'expired' && cert.status === 'expired');
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Certificate['status']) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="success" badgeStyle="solid">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Active
          </Badge>
        );
      case 'expiring_soon':
        return (
          <Badge variant="warning" badgeStyle="solid">
            <Clock className="mr-1 h-3 w-3" />
            Expiring Soon
          </Badge>
        );
      case 'expired':
        return (
          <Badge variant="error" badgeStyle="solid">
            Expired
          </Badge>
        );
    }
  };

  const handleDownload = (cert: Certificate) => {
    // Simulate download
    alert(`Downloading certificate: ${cert.title}`);
  };

  const handleShare = (cert: Certificate) => {
    // Simulate share
    const shareUrl = `https://platform.com/verify/${cert.verificationCode}`;
    if (navigator.share) {
      navigator.share({
        title: cert.title,
        text: `I earned ${cert.title} with a score of ${cert.score}%!`,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Share link copied to clipboard!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Award className="h-8 w-8 text-brand-green" />
          <h1 className="text-3xl font-bold">My Certificates</h1>
        </div>
        <p className="text-muted-foreground">View, download, and share your earned certificates</p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Certificates"
          value={stats.totalCertificates}
          subtitle="Earned certificates"
          icon={Award}
          variant="primary"
          animate
        />
        <MetricCard
          title="Active"
          value={stats.activeCertificates}
          subtitle="Currently valid"
          icon={CheckCircle2}
          variant="success"
          animate
        />
        <MetricCard
          title="Expiring Soon"
          value={stats.expiringSoon}
          subtitle="Requires renewal"
          icon={Clock}
          variant="warning"
          animate
        />
        <MetricCard
          title="Avg Score"
          value={`${stats.averageScore}%`}
          subtitle="Average completion"
          icon={Star}
          variant="neutral"
          animate
        />
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          {/* Search */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search certificates by name or course..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Status:</span>
            <div className="flex gap-2">
              {[
                { id: 'all', label: 'All' },
                { id: 'active', label: 'Active' },
                { id: 'expiring', label: 'Expiring Soon' },
                { id: 'expired', label: 'Expired' },
              ].map((status) => (
                <Badge
                  key={status.id}
                  variant={statusFilter === status.id ? 'primary' : 'default'}
                  badgeStyle={statusFilter === status.id ? 'solid' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setStatusFilter(status.id)}
                >
                  {status.label}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Certificates Grid/List */}
      {filteredCertificates.length > 0 ? (
        <div
          className={
            viewMode === 'grid' ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3' : 'flex flex-col gap-4'
          }
        >
          {filteredCertificates.map((cert) => (
            <Card
              key={cert.id}
              className={`hover:shadow-lg transition-all ${cert.status === 'expired' ? 'opacity-60' : ''}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-brand-green/10">
                      <Award className="h-5 w-5 text-brand-green" />
                    </div>
                    {getStatusBadge(cert.status)}
                  </div>
                  <Badge variant="default" badgeStyle="outline">
                    {cert.category}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{cert.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{cert.courseName}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Certificate Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Earned Date:</span>
                    <span className="font-medium">
                      {new Date(cert.earnedDate).toLocaleDateString()}
                    </span>
                  </div>
                  {cert.expiryDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Expiry Date:</span>
                      <span className="font-medium">
                        {new Date(cert.expiryDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Score:</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-green rounded-full"
                          style={{ width: `${cert.score}%` }}
                        />
                      </div>
                      <span className="font-bold text-brand-green">{cert.score}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Instructor:</span>
                    <span className="font-medium">{cert.instructor}</span>
                  </div>
                </div>

                {/* Verification Code */}
                <div className="p-3 rounded-lg bg-accent/50 border">
                  <p className="text-xs text-muted-foreground mb-1">Verification Code</p>
                  <code className="text-xs font-mono font-bold">{cert.verificationCode}</code>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-brand-green hover:bg-brand-green/90"
                    onClick={() => handleDownload(cert)}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setSelectedCertificate(cert)}>
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleShare(cert)}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No certificates found</h3>
            <p className="text-sm text-muted-foreground mb-6">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Complete courses to earn certificates'}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <Button className="bg-brand-blue hover:bg-brand-blue/90">Browse Courses</Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Certificate Preview Modal */}
      {selectedCertificate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Certificate Preview</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setSelectedCertificate(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Certificate Preview */}
              <div className="aspect-[1.414/1] bg-gradient-to-br from-brand-blue/10 via-purple-500/10 to-brand-green/10 rounded-lg border-2 flex items-center justify-center p-8">
                <div className="text-center space-y-4">
                  <Award className="h-20 w-20 text-brand-green mx-auto" />
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Certificate of Completion</p>
                    <h2 className="text-3xl font-bold mb-4">{selectedCertificate.title}</h2>
                    <p className="text-muted-foreground mb-2">This certifies that</p>
                    <p className="text-2xl font-bold mb-4">Sarah Johnson</p>
                    <p className="text-muted-foreground mb-2">has successfully completed</p>
                    <p className="text-xl font-semibold mb-4">{selectedCertificate.courseName}</p>
                    <p className="text-sm text-muted-foreground">
                      with a score of{' '}
                      <span className="font-bold text-brand-green">
                        {selectedCertificate.score}%
                      </span>
                    </p>
                    <p className="text-sm text-muted-foreground mt-4">
                      Earned on {new Date(selectedCertificate.earnedDate).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-muted-foreground mt-6 font-mono">
                      {selectedCertificate.verificationCode}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  className="flex-1 bg-brand-green hover:bg-brand-green/90"
                  onClick={() => handleDownload(selectedCertificate)}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleShare(selectedCertificate)}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Certificate
                </Button>
                <Button variant="outline" className="flex-1">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Verify Online
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
