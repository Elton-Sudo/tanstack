'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MetricCard } from '@/components/visualizations';
import {
  Award,
  Check,
  Copy,
  Download,
  Edit,
  Eye,
  FileText,
  Image,
  Plus,
  Settings,
  Trash2,
  Upload,
} from 'lucide-react';
import { useState } from 'react';

type TemplateStatus = 'Active' | 'Draft' | 'Archived';

interface CertificateTemplate {
  id: number;
  name: string;
  description: string;
  status: TemplateStatus;
  courseName?: string;
  orientation: 'landscape' | 'portrait';
  backgroundColor: string;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  logoUrl?: string;
  signatureUrl?: string;
  createdDate: string;
  lastModified: string;
  usageCount: number;
}

interface DynamicField {
  id: string;
  label: string;
  placeholder: string;
  type: 'text' | 'date' | 'number';
}

export default function CertificateTemplatesPage() {
  const [activeTab, setActiveTab] = useState<'templates' | 'designer'>('templates');
  const [selectedTemplate, setSelectedTemplate] = useState<CertificateTemplate | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  // Mock data
  const templates: CertificateTemplate[] = [
    {
      id: 1,
      name: 'Professional Certificate',
      description: 'Modern professional certificate template with company branding',
      status: 'Active',
      courseName: 'All Courses',
      orientation: 'landscape',
      backgroundColor: '#FFFFFF',
      primaryColor: '#3B8EDE',
      secondaryColor: '#8CB841',
      textColor: '#1F2937',
      logoUrl: '/logo.png',
      signatureUrl: '/signature.png',
      createdDate: '2024-01-15',
      lastModified: '2024-01-20',
      usageCount: 245,
    },
    {
      id: 2,
      name: 'Security Awareness Certificate',
      description: 'Specialized template for security training completion',
      status: 'Active',
      courseName: 'Phishing Awareness Training',
      orientation: 'landscape',
      backgroundColor: '#F9FAFB',
      primaryColor: '#E86A33',
      secondaryColor: '#F5C242',
      textColor: '#111827',
      createdDate: '2024-01-10',
      lastModified: '2024-01-18',
      usageCount: 189,
    },
    {
      id: 3,
      name: 'Compliance Certificate',
      description: 'Template for compliance and regulatory training',
      status: 'Draft',
      courseName: 'Data Protection & Privacy',
      orientation: 'portrait',
      backgroundColor: '#FFFFFF',
      primaryColor: '#8CB841',
      secondaryColor: '#3B8EDE',
      textColor: '#1F2937',
      createdDate: '2024-01-22',
      lastModified: '2024-01-22',
      usageCount: 0,
    },
    {
      id: 4,
      name: 'Classic Certificate',
      description: 'Traditional certificate design with border',
      status: 'Archived',
      courseName: 'All Courses',
      orientation: 'landscape',
      backgroundColor: '#FFF8DC',
      primaryColor: '#8B4513',
      secondaryColor: '#DAA520',
      textColor: '#2C1810',
      createdDate: '2023-12-01',
      lastModified: '2024-01-05',
      usageCount: 512,
    },
  ];

  const dynamicFields: DynamicField[] = [
    { id: 'recipient_name', label: 'Recipient Name', placeholder: 'John Doe', type: 'text' },
    { id: 'course_name', label: 'Course Name', placeholder: 'Phishing Awareness', type: 'text' },
    {
      id: 'completion_date',
      label: 'Completion Date',
      placeholder: '2024-01-20',
      type: 'date',
    },
    { id: 'score', label: 'Score', placeholder: '95', type: 'number' },
    { id: 'instructor', label: 'Instructor Name', placeholder: 'Dr. Sarah Johnson', type: 'text' },
    { id: 'certificate_id', label: 'Certificate ID', placeholder: 'CERT-2024-001', type: 'text' },
  ];

  // Calculate stats
  const totalTemplates = templates.length;
  const activeTemplates = templates.filter((t) => t.status === 'Active').length;
  const totalIssued = templates.reduce((sum, t) => sum + t.usageCount, 0);

  const getStatusColor = (status: TemplateStatus) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Draft':
        return 'warning';
      case 'Archived':
        return 'secondary';
    }
  };

  const handleCreateTemplate = () => {
    setSelectedTemplate(null);
    setActiveTab('designer');
  };

  const handleEditTemplate = (template: CertificateTemplate) => {
    setSelectedTemplate(template);
    setActiveTab('designer');
  };

  const handlePreviewTemplate = (template: CertificateTemplate) => {
    setSelectedTemplate(template);
    setPreviewMode(true);
  };

  const handleDuplicateTemplate = (templateId: number) => {
    alert(`Duplicate template ${templateId}`);
  };

  const handleDeleteTemplate = (templateId: number) => {
    alert(`Delete template ${templateId}?`);
  };

  const handleSaveTemplate = () => {
    alert('Template saved successfully!');
    setActiveTab('templates');
  };

  const handleUploadLogo = () => {
    alert('Upload logo file');
  };

  const handleUploadSignature = () => {
    alert('Upload signature file');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Award className="h-8 w-8 text-brand-blue" />
          <h1 className="text-3xl font-bold">Certificate Templates</h1>
        </div>
        <p className="text-muted-foreground">
          Design and manage certificate templates for course completions
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Templates"
          value={totalTemplates}
          subtitle="Available templates"
          icon={FileText}
          variant="primary"
          animate
        />
        <MetricCard
          title="Active Templates"
          value={activeTemplates}
          subtitle="Currently in use"
          icon={Check}
          variant="success"
          animate
        />
        <MetricCard
          title="Certificates Issued"
          value={totalIssued}
          subtitle="Total certificates"
          trend={{
            value: 18,
            isPositive: true,
            label: 'this month',
          }}
          icon={Award}
          variant="neutral"
          animate
        />
        <MetricCard
          title="Dynamic Fields"
          value={dynamicFields.length}
          subtitle="Available fields"
          icon={Settings}
          variant="primary"
          animate
        />
      </div>

      {/* Main Content */}
      <div className="border-b">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('templates')}
            className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'templates'
                ? 'border-brand-blue text-brand-blue'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Templates
          </button>
          <button
            onClick={() => setActiveTab('designer')}
            className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'designer'
                ? 'border-brand-blue text-brand-blue'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Template Designer
          </button>
        </div>
      </div>

      {/* Templates List Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Button onClick={handleCreateTemplate} className="bg-brand-blue hover:bg-brand-blue/90">
              <Plus className="mr-2 h-4 w-4" />
              Create Template
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                    </div>
                    <Badge variant={getStatusColor(template.status)}>{template.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Template Preview */}
                  <div
                    className={`${template.orientation === 'landscape' ? 'aspect-video' : 'aspect-[3/4]'} rounded-lg border-2 border-dashed flex items-center justify-center relative overflow-hidden`}
                    style={{
                      backgroundColor: template.backgroundColor,
                      borderColor: template.primaryColor,
                    }}
                  >
                    <div className="text-center p-4">
                      <Award
                        className="h-12 w-12 mx-auto mb-2"
                        style={{ color: template.primaryColor }}
                      />
                      <p className="text-xs font-semibold" style={{ color: template.primaryColor }}>
                        Certificate Preview
                      </p>
                    </div>
                  </div>

                  {/* Template Info */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Orientation:</span>
                      <span className="font-medium capitalize">{template.orientation}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Course:</span>
                      <span className="font-medium text-xs">{template.courseName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Usage:</span>
                      <span className="font-medium">{template.usageCount} times</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Modified:</span>
                      <span className="font-medium text-xs">{template.lastModified}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePreviewTemplate(template)}
                      className="flex-1"
                    >
                      <Eye className="mr-1 h-4 w-4" />
                      Preview
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditTemplate(template)}
                      className="flex-1"
                    >
                      <Edit className="mr-1 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDuplicateTemplate(template.id)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTemplate(template.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Template Designer Tab */}
      {activeTab === 'designer' && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Configuration Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Template Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="template-name">Template Name</Label>
                  <Input
                    id="template-name"
                    defaultValue={selectedTemplate?.name}
                    placeholder="Enter template name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="template-description">Description</Label>
                  <Input
                    id="template-description"
                    defaultValue={selectedTemplate?.description}
                    placeholder="Describe this template"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="course-name">Associated Course</Label>
                  <Input
                    id="course-name"
                    defaultValue={selectedTemplate?.courseName}
                    placeholder="All Courses or specific course"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Orientation</Label>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      className={`flex-1 ${selectedTemplate?.orientation === 'landscape' ? 'bg-brand-blue/10 text-brand-blue' : ''}`}
                    >
                      Landscape
                    </Button>
                    <Button
                      variant="ghost"
                      className={`flex-1 ${selectedTemplate?.orientation === 'portrait' ? 'bg-brand-blue/10 text-brand-blue' : ''}`}
                    >
                      Portrait
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <div className="flex gap-2">
                    {['Active', 'Draft', 'Archived'].map((status) => (
                      <Button
                        key={status}
                        variant="ghost"
                        size="sm"
                        className={
                          selectedTemplate?.status === status
                            ? 'bg-brand-blue/10 text-brand-blue'
                            : ''
                        }
                      >
                        {status}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Colors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="bg-color">Background</Label>
                    <div className="flex gap-2">
                      <Input
                        id="bg-color"
                        type="color"
                        defaultValue={selectedTemplate?.backgroundColor || '#FFFFFF'}
                        className="w-20 h-10"
                      />
                      <Input
                        defaultValue={selectedTemplate?.backgroundColor || '#FFFFFF'}
                        placeholder="#FFFFFF"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="primary-color">Primary</Label>
                    <div className="flex gap-2">
                      <Input
                        id="primary-color"
                        type="color"
                        defaultValue={selectedTemplate?.primaryColor || '#3B8EDE'}
                        className="w-20 h-10"
                      />
                      <Input
                        defaultValue={selectedTemplate?.primaryColor || '#3B8EDE'}
                        placeholder="#3B8EDE"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondary-color">Secondary</Label>
                    <div className="flex gap-2">
                      <Input
                        id="secondary-color"
                        type="color"
                        defaultValue={selectedTemplate?.secondaryColor || '#8CB841'}
                        className="w-20 h-10"
                      />
                      <Input
                        defaultValue={selectedTemplate?.secondaryColor || '#8CB841'}
                        placeholder="#8CB841"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="text-color">Text</Label>
                    <div className="flex gap-2">
                      <Input
                        id="text-color"
                        type="color"
                        defaultValue={selectedTemplate?.textColor || '#1F2937'}
                        className="w-20 h-10"
                      />
                      <Input
                        defaultValue={selectedTemplate?.textColor || '#1F2937'}
                        placeholder="#1F2937"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Assets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Logo</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <Button variant="outline" onClick={handleUploadLogo}>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Logo
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      PNG or SVG, max 500px width
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Signature</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <Button variant="outline" onClick={handleUploadSignature}>
                      <Image className="mr-2 h-4 w-4" />
                      Upload Signature
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">PNG, max 300px width</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dynamic Fields</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Use these fields in your certificate template. They will be automatically
                  populated when certificates are generated.
                </p>
                <div className="space-y-2">
                  {dynamicFields.map((field) => (
                    <div
                      key={field.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-sm">{field.label}</p>
                        <code className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                          {`{{${field.id}}}`}
                        </code>
                      </div>
                      <Badge variant="secondary">{field.type}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`${selectedTemplate?.orientation === 'portrait' ? 'aspect-[3/4]' : 'aspect-video'} rounded-lg border-2 p-8 flex flex-col items-center justify-center`}
                  style={{
                    backgroundColor: selectedTemplate?.backgroundColor || '#FFFFFF',
                    borderColor: selectedTemplate?.primaryColor || '#3B8EDE',
                    color: selectedTemplate?.textColor || '#1F2937',
                  }}
                >
                  {/* Certificate Content */}
                  <div className="text-center space-y-6 w-full">
                    <Award
                      className="h-16 w-16 mx-auto"
                      style={{ color: selectedTemplate?.primaryColor || '#3B8EDE' }}
                    />

                    <div className="space-y-2">
                      <h2
                        className="text-2xl font-bold"
                        style={{ color: selectedTemplate?.primaryColor || '#3B8EDE' }}
                      >
                        Certificate of Completion
                      </h2>
                      <p className="text-sm">This is to certify that</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xl font-bold">{'{{recipient_name}}'}</p>
                      <p className="text-sm">has successfully completed</p>
                    </div>

                    <p className="text-lg font-semibold">{'{{course_name}}'}</p>

                    <div className="flex items-center justify-center gap-8 pt-4">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Date</p>
                        <p className="font-medium">{'{{completion_date}}'}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Score</p>
                        <p className="font-medium">{'{{score}}%'}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Certificate ID</p>
                        <p className="font-medium text-xs">{'{{certificate_id}}'}</p>
                      </div>
                    </div>

                    <div className="pt-8 border-t">
                      <p className="text-xs">Authorized Signature</p>
                      <p className="font-medium">{'{{instructor}}'}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button variant="outline" className="flex-1">
                    <Eye className="mr-2 h-4 w-4" />
                    Full Preview
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Download className="mr-2 h-4 w-4" />
                    Export PDF
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setActiveTab('templates')}>
                Cancel
              </Button>
              <Button onClick={handleSaveTemplate} className="bg-brand-blue hover:bg-brand-blue/90">
                <Check className="mr-2 h-4 w-4" />
                Save Template
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewMode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Template Preview: {selectedTemplate?.name}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setPreviewMode(false)}>
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div
                className={`${selectedTemplate?.orientation === 'portrait' ? 'aspect-[3/4]' : 'aspect-video'} rounded-lg border-2 p-12 flex flex-col items-center justify-center`}
                style={{
                  backgroundColor: selectedTemplate?.backgroundColor,
                  borderColor: selectedTemplate?.primaryColor,
                  color: selectedTemplate?.textColor,
                }}
              >
                <Award
                  className="h-20 w-20 mx-auto mb-6"
                  style={{ color: selectedTemplate?.primaryColor }}
                />
                <h2
                  className="text-3xl font-bold mb-4"
                  style={{ color: selectedTemplate?.primaryColor }}
                >
                  Certificate of Completion
                </h2>
                <p className="text-lg mb-6">Sample preview with placeholder data</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
