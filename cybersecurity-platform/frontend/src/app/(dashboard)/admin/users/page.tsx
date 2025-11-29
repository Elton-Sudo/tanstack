'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MetricCard } from '@/components/visualizations';
import {
  CheckCircle2,
  Download,
  Edit,
  MoreVertical,
  Search,
  Shield,
  Trash2,
  UserCheck,
  UserMinus,
  UserPlus,
  Users,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';

type UserRole = 'Admin' | 'Manager' | 'User' | 'Viewer';
type UserStatus = 'Active' | 'Inactive' | 'Suspended';

interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  department: string;
  lastActive: string;
  enrolledCourses: number;
  completedCourses: number;
  joinedDate: string;
}

interface ActivityLog {
  id: number;
  userId: number;
  userName: string;
  action: string;
  timestamp: string;
  details: string;
}

export default function UserManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [showActivityLog, setShowActivityLog] = useState(false);

  // Mock data
  const users: User[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@company.com',
      role: 'Admin',
      status: 'Active',
      department: 'IT Security',
      lastActive: '2 hours ago',
      enrolledCourses: 12,
      completedCourses: 8,
      joinedDate: '2023-01-15',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@company.com',
      role: 'Manager',
      status: 'Active',
      department: 'Operations',
      lastActive: '1 day ago',
      enrolledCourses: 8,
      completedCourses: 6,
      joinedDate: '2023-02-20',
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@company.com',
      role: 'User',
      status: 'Active',
      department: 'Sales',
      lastActive: '3 hours ago',
      enrolledCourses: 5,
      completedCourses: 3,
      joinedDate: '2023-03-10',
    },
    {
      id: 4,
      name: 'Sarah Williams',
      email: 'sarah.williams@company.com',
      role: 'User',
      status: 'Inactive',
      department: 'Marketing',
      lastActive: '2 weeks ago',
      enrolledCourses: 4,
      completedCourses: 1,
      joinedDate: '2023-04-05',
    },
    {
      id: 5,
      name: 'Robert Brown',
      email: 'robert.brown@company.com',
      role: 'Viewer',
      status: 'Active',
      department: 'HR',
      lastActive: '5 hours ago',
      enrolledCourses: 3,
      completedCourses: 2,
      joinedDate: '2023-05-12',
    },
    {
      id: 6,
      name: 'Emily Davis',
      email: 'emily.davis@company.com',
      role: 'Manager',
      status: 'Active',
      department: 'IT Security',
      lastActive: '1 hour ago',
      enrolledCourses: 10,
      completedCourses: 7,
      joinedDate: '2023-01-28',
    },
    {
      id: 7,
      name: 'David Wilson',
      email: 'david.wilson@company.com',
      role: 'User',
      status: 'Suspended',
      department: 'Finance',
      lastActive: '1 month ago',
      enrolledCourses: 2,
      completedCourses: 0,
      joinedDate: '2023-06-15',
    },
    {
      id: 8,
      name: 'Lisa Anderson',
      email: 'lisa.anderson@company.com',
      role: 'User',
      status: 'Active',
      department: 'Operations',
      lastActive: '30 minutes ago',
      enrolledCourses: 6,
      completedCourses: 4,
      joinedDate: '2023-02-14',
    },
  ];

  const activityLogs: ActivityLog[] = [
    {
      id: 1,
      userId: 1,
      userName: 'John Doe',
      action: 'User Created',
      timestamp: '2024-01-20 14:30',
      details: 'Created new user: Jane Smith',
    },
    {
      id: 2,
      userId: 2,
      userName: 'Jane Smith',
      action: 'Role Changed',
      timestamp: '2024-01-20 13:15',
      details: 'Changed role from User to Manager',
    },
    {
      id: 3,
      userId: 1,
      userName: 'John Doe',
      action: 'User Suspended',
      timestamp: '2024-01-19 16:45',
      details: 'Suspended user: David Wilson',
    },
    {
      id: 4,
      userId: 6,
      userName: 'Emily Davis',
      action: 'Bulk Export',
      timestamp: '2024-01-19 10:20',
      details: 'Exported user data (25 users)',
    },
    {
      id: 5,
      userId: 1,
      userName: 'John Doe',
      action: 'User Activated',
      timestamp: '2024-01-18 09:30',
      details: 'Activated user: Sarah Williams',
    },
  ];

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchQuery === '' ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Calculate stats
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === 'Active').length;
  const inactiveUsers = users.filter((u) => u.status === 'Inactive').length;
  const suspendedUsers = users.filter((u) => u.status === 'Suspended').length;

  // Handle user selection
  const toggleUserSelection = (userId: number) => {
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

  const handleExport = () => {
    alert('Exporting user data to CSV...');
  };

  const handleAddUser = () => {
    alert('Add new user dialog would open here');
  };

  const handleEditUser = (userId: number) => {
    alert(`Edit user ${userId} dialog would open here`);
  };

  const handleDeleteUser = (userId: number) => {
    alert(`Delete user ${userId}?`);
  };

  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case 'Active':
        return 'bg-brand-green/10 text-brand-green-700 dark:text-brand-green-400';
      case 'Inactive':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
      case 'Suspended':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'Admin':
        return 'bg-brand-blue/10 text-brand-blue-700 dark:text-brand-blue-400';
      case 'Manager':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400';
      case 'User':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
      case 'Viewer':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Users className="h-8 w-8 text-brand-blue" />
          <h1 className="text-3xl font-bold">User Management</h1>
        </div>
        <p className="text-muted-foreground">
          Manage user accounts, roles, and permissions across your organization
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Users"
          value={totalUsers}
          subtitle="All registered users"
          icon={Users}
          variant="primary"
          animate
        />
        <MetricCard
          title="Active Users"
          value={activeUsers}
          subtitle="Currently active"
          trend={{
            value: 12,
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
          subtitle="Not recently active"
          icon={UserMinus}
          variant="neutral"
          animate
        />
        <MetricCard
          title="Suspended"
          value={suspendedUsers}
          subtitle="Temporarily disabled"
          icon={XCircle}
          variant="error"
          animate
        />
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Filters and Actions */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users by name, email, or department..."
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
                    {['All', 'Admin', 'Manager', 'User', 'Viewer'].map((role) => (
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

              <div className="flex items-center gap-2">
                <Label className="text-sm text-muted-foreground">Status:</Label>
                <div className="flex gap-2">
                  {['All', 'Active', 'Inactive', 'Suspended'].map((status) => (
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

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex gap-2">
                  <Button onClick={handleAddUser} className="bg-brand-blue hover:bg-brand-blue/90">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add User
                  </Button>
                  <Button variant="outline" onClick={handleExport}>
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>

                {selectedUsers.length > 0 && (
                  <div className="flex gap-2">
                    <span className="text-sm text-muted-foreground self-center">
                      {selectedUsers.length} selected
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkAction('Activate')}
                    >
                      Activate
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkAction('Deactivate')}
                    >
                      Deactivate
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkAction('Delete')}
                      className="text-red-600 hover:text-red-700"
                    >
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
                {searchQuery || roleFilter !== 'All' || statusFilter !== 'All' ? ` - Filtered` : ''}
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
                            filteredUsers.length > 0 &&
                            selectedUsers.length === filteredUsers.length
                          }
                          onChange={toggleSelectAll}
                          className="rounded border-gray-300"
                        />
                      </th>
                      <th className="pb-3 font-medium">User</th>
                      <th className="pb-3 font-medium">Role</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Department</th>
                      <th className="pb-3 font-medium">Courses</th>
                      <th className="pb-3 font-medium">Last Active</th>
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
                            <p className="font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
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
                          <div className="text-xs">
                            <span className="font-medium">{user.completedCourses}</span>/
                            {user.enrolledCourses}
                          </div>
                        </td>
                        <td className="py-4 text-muted-foreground text-xs">{user.lastActive}</td>
                        <td className="py-4">
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditUser(user.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
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

        {/* Sidebar - Activity Log */}
        <div>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-brand-blue" />
                  Activity Log
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowActivityLog(!showActivityLog)}
                >
                  {showActivityLog ? 'Hide' : 'Show'} All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activityLogs.slice(0, showActivityLog ? undefined : 5).map((log) => (
                  <div key={log.id} className="border-b last:border-0 pb-4 last:pb-0">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-brand-blue/10 flex items-center justify-center flex-shrink-0">
                        {log.action.includes('Created') ? (
                          <UserPlus className="h-4 w-4 text-brand-blue" />
                        ) : log.action.includes('Suspended') ? (
                          <XCircle className="h-4 w-4 text-red-600" />
                        ) : log.action.includes('Activated') ? (
                          <CheckCircle2 className="h-4 w-4 text-brand-green" />
                        ) : log.action.includes('Export') ? (
                          <Download className="h-4 w-4 text-brand-blue" />
                        ) : (
                          <Shield className="h-4 w-4 text-brand-blue" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{log.action}</p>
                        <p className="text-xs text-muted-foreground mt-1">{log.details}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <span>{log.userName}</span>
                          <span>•</span>
                          <span>{log.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Role Distribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(['Admin', 'Manager', 'User', 'Viewer'] as UserRole[]).map((role) => {
                const count = users.filter((u) => u.role === role).length;
                const percentage = ((count / users.length) * 100).toFixed(0);
                return (
                  <div key={role} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{role}</span>
                      <span className="text-muted-foreground">
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-blue rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
