'use client';

import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MetricCard } from '@/components/visualizations';
import {
  BookOpen,
  CheckCircle2,
  Download,
  Edit,
  Mail,
  MoreVertical,
  Plus,
  Search,
  Trash2,
  Upload,
  UserCheck,
  UserMinus,
  UserPlus,
  Users,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

type UserRole = 'ADMIN' | 'MANAGER' | 'USER';
type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  department: string;
  position: string;
  enrolledCourses: number;
  completedCourses: number;
  averageScore: number;
  lastLoginAt: string;
  createdAt: string;
}

export default function TenantUserManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [departmentFilter, setDepartmentFilter] = useState<string>('All');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Mock data - will be replaced with API calls
  const users: User[] = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@company.com',
      role: 'ADMIN',
      status: 'ACTIVE',
      department: 'IT Security',
      position: 'Security Manager',
      enrolledCourses: 12,
      completedCourses: 10,
      averageScore: 92.5,
      lastLoginAt: '2024-11-30T10:30:00Z',
      createdAt: '2023-01-15',
    },
    {
      id: '2',
      firstName: 'Sarah',
      lastName: 'Williams',
      email: 'sarah.williams@company.com',
      role: 'MANAGER',
      status: 'ACTIVE',
      department: 'Operations',
      position: 'Operations Lead',
      enrolledCourses: 8,
      completedCourses: 7,
      averageScore: 88.3,
      lastLoginAt: '2024-11-30T09:15:00Z',
      createdAt: '2023-02-20',
    },
    {
      id: '3',
      firstName: 'Mike',
      lastName: 'Johnson',
      email: 'mike.johnson@company.com',
      role: 'USER',
      status: 'ACTIVE',
      department: 'Sales',
      position: 'Sales Representative',
      enrolledCourses: 5,
      completedCourses: 4,
      averageScore: 85.7,
      lastLoginAt: '2024-11-29T16:45:00Z',
      createdAt: '2023-03-10',
    },
    {
      id: '4',
      firstName: 'Emily',
      lastName: 'Davis',
      email: 'emily.davis@company.com',
      role: 'USER',
      status: 'INACTIVE',
      department: 'Marketing',
      position: 'Marketing Specialist',
      enrolledCourses: 6,
      completedCourses: 2,
      averageScore: 78.5,
      lastLoginAt: '2024-11-15T14:20:00Z',
      createdAt: '2023-04-05',
    },
    {
      id: '5',
      firstName: 'Robert',
      lastName: 'Brown',
      email: 'robert.brown@company.com',
      role: 'USER',
      status: 'ACTIVE',
      department: 'HR',
      position: 'HR Coordinator',
      enrolledCourses: 4,
      completedCourses: 4,
      averageScore: 91.2,
      lastLoginAt: '2024-11-30T11:00:00Z',
      createdAt: '2023-05-12',
    },
    {
      id: '6',
      firstName: 'Lisa',
      lastName: 'Anderson',
      email: 'lisa.anderson@company.com',
      role: 'MANAGER',
      status: 'ACTIVE',
      department: 'Finance',
      position: 'Finance Manager',
      enrolledCourses: 9,
      completedCourses: 8,
      averageScore: 94.1,
      lastLoginAt: '2024-11-30T08:30:00Z',
      createdAt: '2023-01-28',
    },
  ];

  const departments = ['All', ...new Set(users.map((u) => u.department))];

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchQuery === '' ||
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
    const matchesDepartment = departmentFilter === 'All' || user.department === departmentFilter;
    return matchesSearch && matchesRole && matchesStatus && matchesDepartment;
  });

  // Calculate stats
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === 'ACTIVE').length;
  const inactiveUsers = users.filter((u) => u.status === 'INACTIVE').length;
  const avgCompletionRate =
    users.reduce((sum, u) => sum + (u.completedCourses / (u.enrolledCourses || 1)) * 100, 0) /
    users.length;

  // Handle user selection
  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId],
    );
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((u) => u.id));
    }
  };

  const handleBulkAction = (action: string) => {
    alert(`Bulk action: ${action} on ${selectedUsers.length} users`);
    setSelectedUsers([]);
  };

  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-brand-green/10 text-brand-green-700 dark:text-brand-green-400';
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
      case 'SUSPENDED':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400';
      case 'MANAGER':
        return 'bg-brand-blue/10 text-brand-blue-700 dark:text-brand-blue-400';
      case 'USER':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return formatDate(dateString);
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Team Management', href: '/manage' },
          { label: 'User Management', href: '/manage/users' },
        ]}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-8 w-8 text-brand-blue" />
            <h1 className="text-3xl font-bold">User Management</h1>
          </div>
          <p className="text-muted-foreground">
            Manage your team members, assign courses, and track learning progress
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import CSV
          </Button>
          <Button className="bg-brand-blue hover:bg-brand-blue/90">
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Users"
          value={totalUsers}
          subtitle="All team members"
          icon={Users}
          variant="primary"
          animate
        />
        <MetricCard
          title="Active Users"
          value={activeUsers}
          subtitle={`${((activeUsers / totalUsers) * 100).toFixed(0)}% of total`}
          trend={{
            value: 8.3,
            isPositive: true,
            label: 'vs last month',
          }}
          icon={UserCheck}
          variant="success"
          animate
        />
        <MetricCard
          title="Inactive Users"
          value={inactiveUsers}
          subtitle="Need attention"
          icon={UserMinus}
          variant="warning"
          animate
        />
        <MetricCard
          title="Avg Completion"
          value={`${avgCompletionRate.toFixed(1)}%`}
          subtitle="Course completion rate"
          icon={CheckCircle2}
          variant="neutral"
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
              placeholder="Search by name, email, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Label className="text-sm text-muted-foreground">Role:</Label>
              <div className="flex gap-2">
                {['All', 'ADMIN', 'MANAGER', 'USER'].map((role) => (
                  <Badge
                    key={role}
                    variant={roleFilter === role ? 'primary' : 'default'}
                    badgeStyle={roleFilter === role ? 'solid' : 'outline'}
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => setRoleFilter(role)}
                  >
                    {role}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Label className="text-sm text-muted-foreground">Status:</Label>
              <div className="flex gap-2">
                {['All', 'ACTIVE', 'INACTIVE', 'SUSPENDED'].map((status) => (
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
            <Label className="text-sm text-muted-foreground">Department:</Label>
            <div className="flex gap-2 flex-wrap">
              {departments.map((dept) => (
                <Badge
                  key={dept}
                  variant={departmentFilter === dept ? 'primary' : 'default'}
                  badgeStyle={departmentFilter === dept ? 'solid' : 'outline'}
                  className="cursor-pointer hover:bg-accent"
                  onClick={() => setDepartmentFilter(dept)}
                >
                  {dept}
                </Badge>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button variant="outline">
                <Mail className="mr-2 h-4 w-4" />
                Send Email
              </Button>
            </div>

            {selectedUsers.length > 0 && (
              <div className="flex gap-2">
                <span className="text-sm text-muted-foreground self-center">
                  {selectedUsers.length} selected
                </span>
                <Button variant="outline" size="sm" onClick={() => handleBulkAction('Assign Course')}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  Assign Course
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkAction('Deactivate')}>
                  Deactivate
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

      {/* User Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Users ({filteredUsers.length})
            {(searchQuery || roleFilter !== 'All' || statusFilter !== 'All' || departmentFilter !== 'All') &&
              ` - Filtered`}
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
                      checked={filteredUsers.length > 0 && selectedUsers.length === filteredUsers.length}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="pb-3 font-medium">User</th>
                  <th className="pb-3 font-medium">Role</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Department</th>
                  <th className="pb-3 font-medium">Progress</th>
                  <th className="pb-3 font-medium">Avg Score</th>
                  <th className="pb-3 font-medium">Last Login</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="text-sm hover:bg-accent/50">
                    <td className="py-4 pr-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleUserSelection(user.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="py-4">
                      <div>
                        <p className="font-medium">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                        <p className="text-xs text-muted-foreground">{user.position}</p>
                      </div>
                    </td>
                    <td className="py-4">
                      <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                    </td>
                    <td className="py-4">
                      <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                    </td>
                    <td className="py-4 text-muted-foreground">{user.department}</td>
                    <td className="py-4">
                      <div>
                        <p className="text-xs font-medium">
                          {user.completedCourses}/{user.enrolledCourses} courses
                        </p>
                        <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden mt-1">
                          <div
                            className="h-full bg-brand-blue rounded-full"
                            style={{
                              width: `${(user.completedCourses / (user.enrolledCourses || 1)) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="font-medium">{user.averageScore.toFixed(1)}%</span>
                    </td>
                    <td className="py-4 text-xs text-muted-foreground">{getTimeAgo(user.lastLoginAt)}</td>
                    <td className="py-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/manage/users/${user.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm">
                          <BookOpen className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-semibold">No users found</p>
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
