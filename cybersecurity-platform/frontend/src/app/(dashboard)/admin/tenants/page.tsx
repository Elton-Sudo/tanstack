'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MetricCard } from '@/components/visualizations';
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  Download,
  Edit,
  Eye,
  MoreVertical,
  Pause,
  Play,
  Plus,
  Search,
  Trash2,
  Users,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

type TenantStatus = 'ACTIVE' | 'TRIAL' | 'SUSPENDED' | 'EXPIRED';
type SubscriptionPlan = 'FREE' | 'TRIAL' | 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE';

interface Tenant {
  id: string;
  name: string;
  slug: string;
  status: TenantStatus;
  subscriptionPlan: SubscriptionPlan;
  userCount: number;
  maxUsers: number;
  courseCount: number;
  subscriptionEndDate: string;
  createdAt: string;
  contactEmail: string;
}

export default function TenantsListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [planFilter, setPlanFilter] = useState<string>('All');
  const [selectedTenants, setSelectedTenants] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Mock data - will be replaced with API calls
  const tenants: Tenant[] = [
    {
      id: '1',
      name: 'Acme Corporation',
      slug: 'acme',
      status: 'ACTIVE',
      subscriptionPlan: 'PROFESSIONAL',
      userCount: 145,
      maxUsers: 200,
      courseCount: 23,
      subscriptionEndDate: '2025-06-15',
      createdAt: '2023-01-15',
      contactEmail: 'admin@acme.com',
    },
    {
      id: '2',
      name: 'TechStart Solutions',
      slug: 'techstart',
      status: 'ACTIVE',
      subscriptionPlan: 'STARTER',
      userCount: 28,
      maxUsers: 50,
      courseCount: 12,
      subscriptionEndDate: '2025-03-20',
      createdAt: '2023-05-10',
      contactEmail: 'contact@techstart.com',
    },
    {
      id: '3',
      name: 'GlobalTech Inc',
      slug: 'globaltech',
      status: 'SUSPENDED',
      subscriptionPlan: 'ENTERPRISE',
      userCount: 450,
      maxUsers: 1000,
      courseCount: 45,
      subscriptionEndDate: '2024-11-30',
      createdAt: '2022-08-22',
      contactEmail: 'admin@globaltech.com',
    },
    {
      id: '4',
      name: 'SecureNet Solutions',
      slug: 'securenet',
      status: 'TRIAL',
      subscriptionPlan: 'TRIAL',
      userCount: 8,
      maxUsers: 10,
      courseCount: 5,
      subscriptionEndDate: '2024-12-02',
      createdAt: '2024-11-18',
      contactEmail: 'info@securenet.com',
    },
    {
      id: '5',
      name: 'DataFlow Analytics',
      slug: 'dataflow',
      status: 'ACTIVE',
      subscriptionPlan: 'PROFESSIONAL',
      userCount: 185,
      maxUsers: 200,
      courseCount: 31,
      subscriptionEndDate: '2025-04-10',
      createdAt: '2023-03-05',
      contactEmail: 'team@dataflow.com',
    },
    {
      id: '6',
      name: 'SmallBiz Hub',
      slug: 'smallbiz',
      status: 'ACTIVE',
      subscriptionPlan: 'STARTER',
      userCount: 12,
      maxUsers: 50,
      courseCount: 8,
      subscriptionEndDate: '2025-02-28',
      createdAt: '2024-02-14',
      contactEmail: 'owner@smallbiz.com',
    },
    {
      id: '7',
      name: 'Enterprise Systems Ltd',
      slug: 'entsys',
      status: 'ACTIVE',
      subscriptionPlan: 'ENTERPRISE',
      userCount: 890,
      maxUsers: -1,
      courseCount: 67,
      subscriptionEndDate: '2026-01-01',
      createdAt: '2022-01-10',
      contactEmail: 'admin@entsys.com',
    },
    {
      id: '8',
      name: 'CyberGuard Inc',
      slug: 'cyberguard',
      status: 'EXPIRED',
      subscriptionPlan: 'PROFESSIONAL',
      userCount: 92,
      maxUsers: 200,
      courseCount: 18,
      subscriptionEndDate: '2024-10-15',
      createdAt: '2023-10-15',
      contactEmail: 'billing@cyberguard.com',
    },
  ];

  // Filter tenants
  const filteredTenants = tenants.filter((tenant) => {
    const matchesSearch =
      searchQuery === '' ||
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.contactEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || tenant.status === statusFilter;
    const matchesPlan = planFilter === 'All' || tenant.subscriptionPlan === planFilter;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  // Calculate stats
  const totalTenants = tenants.length;
  const activeTenants = tenants.filter((t) => t.status === 'ACTIVE').length;
  const trialTenants = tenants.filter((t) => t.status === 'TRIAL').length;
  const suspendedTenants = tenants.filter((t) => t.status === 'SUSPENDED').length;

  // Handle tenant selection
  const toggleTenantSelection = (tenantId: string) => {
    setSelectedTenants((prev) =>
      prev.includes(tenantId) ? prev.filter((id) => id !== tenantId) : [...prev, tenantId],
    );
  };

  const toggleSelectAll = () => {
    if (selectedTenants.length === filteredTenants.length) {
      setSelectedTenants([]);
    } else {
      setSelectedTenants(filteredTenants.map((t) => t.id));
    }
  };

  const handleBulkAction = (action: string) => {
    alert(`Bulk action: ${action} on ${selectedTenants.length} tenants`);
    setSelectedTenants([]);
    setShowBulkActions(false);
  };

  const handleExport = () => {
    alert('Exporting tenant data to CSV...');
  };

  const getStatusColor = (status: TenantStatus) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-brand-green/10 text-brand-green-700 dark:text-brand-green-400';
      case 'TRIAL':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'SUSPENDED':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      case 'EXPIRED':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getPlanColor = (plan: SubscriptionPlan) => {
    switch (plan) {
      case 'FREE':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
      case 'TRIAL':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'STARTER':
        return 'bg-brand-blue/10 text-brand-blue-700 dark:text-brand-blue-400';
      case 'PROFESSIONAL':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400';
      case 'ENTERPRISE':
        return 'bg-brand-green/10 text-brand-green-700 dark:text-brand-green-400';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDaysUntilExpiration = (expirationDate: string) => {
    const days = Math.ceil(
      (new Date(expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
    );
    return days;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="h-8 w-8 text-brand-blue" />
            <h1 className="text-3xl font-bold">Tenant Management</h1>
          </div>
          <p className="text-muted-foreground">Manage all organization accounts and subscriptions</p>
        </div>
        <Button className="bg-brand-blue hover:bg-brand-blue/90" asChild>
          <Link href="/admin/tenants/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Tenant
          </Link>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Tenants"
          value={totalTenants}
          subtitle="All organizations"
          icon={Building2}
          variant="primary"
          animate
        />
        <MetricCard
          title="Active"
          value={activeTenants}
          subtitle="Currently active"
          trend={{
            value: 12,
            isPositive: true,
            label: 'vs last month',
          }}
          icon={CheckCircle2}
          variant="success"
          animate
        />
        <MetricCard
          title="Trial"
          value={trialTenants}
          subtitle="In trial period"
          icon={AlertTriangle}
          variant="warning"
          animate
        />
        <MetricCard
          title="Suspended"
          value={suspendedTenants}
          subtitle="Temporarily disabled"
          icon={XCircle}
          variant="error"
          animate
        />
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tenants by name, slug, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Label className="text-sm text-muted-foreground">Status:</Label>
              <div className="flex gap-2">
                {['All', 'ACTIVE', 'TRIAL', 'SUSPENDED', 'EXPIRED'].map((status) => (
                  <Badge
                    key={status}
                    variant={statusFilter === status ? 'primary' : 'default'}
                    badgeStyle={statusFilter === status ? 'solid' : 'outline'}
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => setStatusFilter(status)}
                  >
                    {status}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Label className="text-sm text-muted-foreground">Plan:</Label>
            <div className="flex gap-2">
              {['All', 'FREE', 'TRIAL', 'STARTER', 'PROFESSIONAL', 'ENTERPRISE'].map((plan) => (
                <Badge
                  key={plan}
                  variant={planFilter === plan ? 'primary' : 'default'}
                  badgeStyle={planFilter === plan ? 'solid' : 'outline'}
                  className="cursor-pointer hover:bg-accent"
                  onClick={() => setPlanFilter(plan)}
                >
                  {plan}
                </Badge>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowBulkActions(!showBulkActions)}
                disabled={selectedTenants.length === 0}
              >
                Bulk Actions ({selectedTenants.length})
              </Button>
            </div>

            {showBulkActions && selectedTenants.length > 0 && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleBulkAction('Activate')}>
                  <Play className="mr-2 h-4 w-4" />
                  Activate
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkAction('Suspend')}>
                  <Pause className="mr-2 h-4 w-4" />
                  Suspend
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('Delete')}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tenant Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Tenants ({filteredTenants.length})
            {searchQuery || statusFilter !== 'All' || planFilter !== 'All' ? ` - Filtered` : ''}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr className="text-left text-sm text-muted-foreground">
                  <th className="pb-3 pr-4">
                    <input
                      type="checkbox"
                      checked={
                        filteredTenants.length > 0 && selectedTenants.length === filteredTenants.length
                      }
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="pb-3 font-medium">Organization</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Plan</th>
                  <th className="pb-3 font-medium">Users</th>
                  <th className="pb-3 font-medium">Courses</th>
                  <th className="pb-3 font-medium">Expires</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredTenants.map((tenant) => {
                  const daysUntilExpiration = getDaysUntilExpiration(tenant.subscriptionEndDate);
                  const isExpiringSoon = daysUntilExpiration <= 7 && daysUntilExpiration > 0;

                  return (
                    <tr key={tenant.id} className="text-sm hover:bg-accent/50">
                      <td className="py-4 pr-4">
                        <input
                          type="checkbox"
                          checked={selectedTenants.includes(tenant.id)}
                          onChange={() => toggleTenantSelection(tenant.id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="py-4">
                        <div>
                          <p className="font-medium">{tenant.name}</p>
                          <p className="text-xs text-muted-foreground">{tenant.slug}</p>
                        </div>
                      </td>
                      <td className="py-4">
                        <Badge className={getStatusColor(tenant.status)}>{tenant.status}</Badge>
                      </td>
                      <td className="py-4">
                        <Badge className={getPlanColor(tenant.subscriptionPlan)}>
                          {tenant.subscriptionPlan}
                        </Badge>
                      </td>
                      <td className="py-4">
                        <div className="text-xs">
                          <span className="font-medium">{tenant.userCount}</span>/
                          {tenant.maxUsers === -1 ? '∞' : tenant.maxUsers}
                        </div>
                      </td>
                      <td className="py-4 text-muted-foreground">{tenant.courseCount}</td>
                      <td className="py-4">
                        <div>
                          <p
                            className={`text-xs font-medium ${isExpiringSoon ? 'text-yellow-600' : ''}`}
                          >
                            {formatDate(tenant.subscriptionEndDate)}
                          </p>
                          {isExpiringSoon && (
                            <p className="text-xs text-yellow-600">in {daysUntilExpiration} days</p>
                          )}
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/tenants/${tenant.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/tenants/${tenant.id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredTenants.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-semibold">No tenants found</p>
              <p className="text-sm text-muted-foreground mt-2">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
