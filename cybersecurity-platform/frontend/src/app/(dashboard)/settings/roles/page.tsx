'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertCircle,
  Check,
  Edit,
  Lock,
  MoreVertical,
  Plus,
  Search,
  Shield,
  Trash2,
  UserCog,
  Users,
  X,
} from 'lucide-react';
import { useState } from 'react';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'users' | 'courses' | 'reports' | 'settings' | 'compliance' | 'system';
}

interface Role {
  id: string;
  name: string;
  description: string;
  type: 'system' | 'custom';
  isActive: boolean;
  userCount: number;
  permissions: string[];
  createdAt: string;
}

export default function RolesPermissionsPage() {
  const [subscriptionPlan] = useState('PROFESSIONAL'); // Replace with actual subscription check
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isCreatingRole, setIsCreatingRole] = useState(false);
  const [showPermissions, setShowPermissions] = useState(false);

  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    permissions: [] as string[],
  });

  // All available permissions
  const allPermissions: Permission[] = [
    // User Management
    {
      id: 'users.view',
      name: 'View Users',
      description: 'View list of users and their details',
      category: 'users',
    },
    {
      id: 'users.create',
      name: 'Create Users',
      description: 'Add new users to the system',
      category: 'users',
    },
    {
      id: 'users.edit',
      name: 'Edit Users',
      description: 'Modify user information and settings',
      category: 'users',
    },
    {
      id: 'users.delete',
      name: 'Delete Users',
      description: 'Remove users from the system',
      category: 'users',
    },
    {
      id: 'users.assign_roles',
      name: 'Assign Roles',
      description: 'Assign roles and permissions to users',
      category: 'users',
    },

    // Course Management
    {
      id: 'courses.view',
      name: 'View Courses',
      description: 'View all available courses',
      category: 'courses',
    },
    {
      id: 'courses.create',
      name: 'Create Courses',
      description: 'Create and upload new courses',
      category: 'courses',
    },
    {
      id: 'courses.edit',
      name: 'Edit Courses',
      description: 'Modify course content and settings',
      category: 'courses',
    },
    {
      id: 'courses.delete',
      name: 'Delete Courses',
      description: 'Remove courses from the system',
      category: 'courses',
    },
    {
      id: 'courses.assign',
      name: 'Assign Courses',
      description: 'Assign courses to users and teams',
      category: 'courses',
    },

    // Reports & Analytics
    {
      id: 'reports.view',
      name: 'View Reports',
      description: 'Access reports and analytics',
      category: 'reports',
    },
    {
      id: 'reports.create',
      name: 'Create Reports',
      description: 'Build custom reports',
      category: 'reports',
    },
    {
      id: 'reports.export',
      name: 'Export Reports',
      description: 'Download and export report data',
      category: 'reports',
    },

    // Settings Management
    {
      id: 'settings.view',
      name: 'View Settings',
      description: 'View system settings',
      category: 'settings',
    },
    {
      id: 'settings.edit',
      name: 'Edit Settings',
      description: 'Modify system settings and configuration',
      category: 'settings',
    },
    {
      id: 'settings.branding',
      name: 'Manage Branding',
      description: 'Customize branding and appearance',
      category: 'settings',
    },

    // Compliance
    {
      id: 'compliance.view',
      name: 'View Compliance',
      description: 'View compliance status and requirements',
      category: 'compliance',
    },
    {
      id: 'compliance.manage',
      name: 'Manage Compliance',
      description: 'Configure compliance rules and policies',
      category: 'compliance',
    },

    // System
    {
      id: 'system.audit_logs',
      name: 'View Audit Logs',
      description: 'Access system audit logs',
      category: 'system',
    },
    {
      id: 'system.integrations',
      name: 'Manage Integrations',
      description: 'Configure third-party integrations',
      category: 'system',
    },
  ];

  // Predefined and custom roles
  const [roles, setRoles] = useState<Role[]>([
    {
      id: '1',
      name: 'Tenant Admin',
      description: 'Full access to all tenant features and settings',
      type: 'system',
      isActive: true,
      userCount: 3,
      permissions: allPermissions.map((p) => p.id),
      createdAt: '2023-01-15',
    },
    {
      id: '2',
      name: 'Manager',
      description: 'Manage team members and view reports',
      type: 'system',
      isActive: true,
      userCount: 8,
      permissions: [
        'users.view',
        'users.create',
        'users.edit',
        'courses.view',
        'courses.assign',
        'reports.view',
        'reports.export',
      ],
      createdAt: '2023-01-15',
    },
    {
      id: '3',
      name: 'User',
      description: 'Basic access to courses and personal profile',
      type: 'system',
      isActive: true,
      userCount: 176,
      permissions: ['courses.view', 'settings.view'],
      createdAt: '2023-01-15',
    },
    {
      id: '4',
      name: 'Content Manager',
      description: 'Manages courses and learning content',
      type: 'custom',
      isActive: true,
      userCount: 5,
      permissions: [
        'courses.view',
        'courses.create',
        'courses.edit',
        'courses.assign',
        'reports.view',
      ],
      createdAt: '2024-03-20',
    },
    {
      id: '5',
      name: 'Compliance Officer',
      description: 'Oversees compliance and risk management',
      type: 'custom',
      isActive: true,
      userCount: 2,
      permissions: [
        'users.view',
        'courses.view',
        'reports.view',
        'reports.create',
        'reports.export',
        'compliance.view',
        'compliance.manage',
        'system.audit_logs',
      ],
      createdAt: '2024-05-10',
    },
  ]);

  const filteredRoles = roles.filter(
    (role) =>
      searchQuery === '' ||
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getCategoryIcon = (category: Permission['category']) => {
    switch (category) {
      case 'users':
        return <Users className="h-4 w-4" />;
      case 'courses':
        return <Shield className="h-4 w-4" />;
      case 'reports':
        return <Shield className="h-4 w-4" />;
      case 'settings':
        return <Shield className="h-4 w-4" />;
      case 'compliance':
        return <Shield className="h-4 w-4" />;
      case 'system':
        return <Shield className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: Permission['category']) => {
    switch (category) {
      case 'users':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'courses':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400';
      case 'reports':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'settings':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'compliance':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      case 'system':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const groupedPermissions = allPermissions.reduce(
    (acc, permission) => {
      if (!acc[permission.category]) {
        acc[permission.category] = [];
      }
      acc[permission.category].push(permission);
      return acc;
    },
    {} as Record<string, Permission[]>,
  );

  const togglePermission = (permissionId: string) => {
    if (!selectedRole) {
      setNewRole((prev) => ({
        ...prev,
        permissions: prev.permissions.includes(permissionId)
          ? prev.permissions.filter((p) => p !== permissionId)
          : [...prev.permissions, permissionId],
      }));
    } else {
      // Update existing role permissions
      setRoles((prev) =>
        prev.map((role) =>
          role.id === selectedRole.id
            ? {
                ...role,
                permissions: role.permissions.includes(permissionId)
                  ? role.permissions.filter((p) => p !== permissionId)
                  : [...role.permissions, permissionId],
              }
            : role,
        ),
      );
      setSelectedRole((prev) =>
        prev
          ? {
              ...prev,
              permissions: prev.permissions.includes(permissionId)
                ? prev.permissions.filter((p) => p !== permissionId)
                : [...prev.permissions, permissionId],
            }
          : null,
      );
    }
  };

  const handleCreateRole = () => {
    if (!newRole.name) return;

    const role: Role = {
      id: String(roles.length + 1),
      name: newRole.name,
      description: newRole.description,
      type: 'custom',
      isActive: true,
      userCount: 0,
      permissions: newRole.permissions,
      createdAt: new Date().toISOString(),
    };

    setRoles([...roles, role]);
    setNewRole({ name: '', description: '', permissions: [] });
    setIsCreatingRole(false);
    setShowPermissions(false);
  };

  const handleDeleteRole = (roleId: string) => {
    setRoles(roles.filter((r) => r.id !== roleId));
    if (selectedRole?.id === roleId) {
      setSelectedRole(null);
    }
  };

  const canCreateCustomRoles =
    subscriptionPlan === 'PROFESSIONAL' || subscriptionPlan === 'ENTERPRISE';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <UserCog className="h-8 w-8 text-brand-blue" />
            <h1 className="text-3xl font-bold">Roles & Permissions</h1>
          </div>
          <p className="text-muted-foreground">
            Manage user roles and configure granular permissions
          </p>
        </div>
        <Button
          className="bg-brand-blue hover:bg-brand-blue/90"
          onClick={() => {
            if (canCreateCustomRoles) {
              setIsCreatingRole(true);
              setSelectedRole(null);
            }
          }}
          disabled={!canCreateCustomRoles}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Custom Role
        </Button>
      </div>

      {!canCreateCustomRoles && (
        <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-600 mb-1">Upgrade Required</p>
                <p className="text-sm text-yellow-600/80">
                  Custom roles are available on Professional and Enterprise plans. Upgrade to create
                  custom roles with specific permissions.
                </p>
              </div>
              <Button variant="outline" size="sm">
                Upgrade Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Roles List */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Roles</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search roles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {filteredRoles.map((role) => (
                <div
                  key={role.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedRole?.id === role.id
                      ? 'border-brand-blue bg-brand-blue/5'
                      : 'hover:bg-accent'
                  }`}
                  onClick={() => {
                    setSelectedRole(role);
                    setIsCreatingRole(false);
                    setShowPermissions(false);
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm">{role.name}</p>
                        {role.type === 'system' && (
                          <Lock className="h-3 w-3 text-muted-foreground" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {role.description}
                      </p>
                    </div>
                    {role.type === 'custom' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteRole(role.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <Badge
                      variant={role.type === 'system' ? 'default' : 'primary'}
                      badgeStyle="outline"
                    >
                      {role.type === 'system' ? 'System' : 'Custom'}
                    </Badge>
                    <span className="text-muted-foreground">{role.userCount} users</span>
                  </div>
                </div>
              ))}

              {filteredRoles.length === 0 && (
                <div className="text-center py-8">
                  <UserCog className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No roles found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Role Details / Create Form */}
        <div className="lg:col-span-2">
          {isCreatingRole ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Create Custom Role</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setIsCreatingRole(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription>Define a new role with specific permissions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="roleName">Role Name *</Label>
                    <Input
                      id="roleName"
                      placeholder="e.g., Content Manager"
                      value={newRole.name}
                      onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="roleDescription">Description</Label>
                    <Textarea
                      id="roleDescription"
                      placeholder="Describe the role's responsibilities..."
                      value={newRole.description}
                      onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Permissions</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPermissions(!showPermissions)}
                    >
                      {showPermissions ? 'Hide' : 'Show'} All Permissions
                    </Button>
                  </div>

                  {showPermissions && (
                    <div className="space-y-6">
                      {Object.entries(groupedPermissions).map(([category, permissions]) => (
                        <div key={category} className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Badge className={getCategoryColor(category as any)}>
                              {category.charAt(0).toUpperCase() + category.slice(1)}
                            </Badge>
                          </div>
                          <div className="grid gap-2 md:grid-cols-2">
                            {permissions.map((permission) => (
                              <label
                                key={permission.id}
                                className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-accent"
                              >
                                <input
                                  type="checkbox"
                                  checked={newRole.permissions.includes(permission.id)}
                                  onChange={() => togglePermission(permission.id)}
                                  className="mt-1"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium">{permission.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {permission.description}
                                  </p>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {!showPermissions && newRole.permissions.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      {newRole.permissions.length} permission(s) selected
                    </p>
                  )}
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCreatingRole(false);
                      setNewRole({ name: '', description: '', permissions: [] });
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-brand-blue hover:bg-brand-blue/90"
                    onClick={handleCreateRole}
                    disabled={!newRole.name || newRole.permissions.length === 0}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Create Role
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : selectedRole ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CardTitle>{selectedRole.name}</CardTitle>
                    {selectedRole.type === 'system' && (
                      <Badge variant="default" badgeStyle="outline">
                        <Lock className="mr-1 h-3 w-3" />
                        System Role
                      </Badge>
                    )}
                  </div>
                  {selectedRole.type === 'custom' && (
                    <Button variant="outline" size="sm">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Role
                    </Button>
                  )}
                </div>
                <CardDescription>{selectedRole.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 rounded-lg bg-accent/50">
                    <p className="text-2xl font-bold">{selectedRole.userCount}</p>
                    <p className="text-sm text-muted-foreground">Users with this role</p>
                  </div>
                  <div className="p-4 rounded-lg bg-accent/50">
                    <p className="text-2xl font-bold">{selectedRole.permissions.length}</p>
                    <p className="text-sm text-muted-foreground">Permissions</p>
                  </div>
                  <div className="p-4 rounded-lg bg-accent/50">
                    <Badge variant={selectedRole.isActive ? 'success' : 'default'}>
                      {selectedRole.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-1">Status</p>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-medium mb-4">Permissions</h3>
                  <div className="space-y-6">
                    {Object.entries(groupedPermissions).map(([category, permissions]) => {
                      const rolePermissions = permissions.filter((p) =>
                        selectedRole.permissions.includes(p.id),
                      );
                      if (rolePermissions.length === 0) return null;

                      return (
                        <div key={category} className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Badge className={getCategoryColor(category as any)}>
                              {category.charAt(0).toUpperCase() + category.slice(1)}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {rolePermissions.length} of {permissions.length}
                            </span>
                          </div>
                          <div className="grid gap-2 md:grid-cols-2">
                            {permissions.map((permission) => {
                              const hasPermission = selectedRole.permissions.includes(
                                permission.id,
                              );
                              return (
                                <label
                                  key={permission.id}
                                  className={`flex items-start gap-3 p-3 rounded-lg border ${
                                    selectedRole.type === 'system'
                                      ? 'cursor-not-allowed opacity-60'
                                      : 'cursor-pointer hover:bg-accent'
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={hasPermission}
                                    onChange={() => togglePermission(permission.id)}
                                    disabled={selectedRole.type === 'system'}
                                    className="mt-1"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium">{permission.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {permission.description}
                                    </p>
                                  </div>
                                  {hasPermission && <Check className="h-4 w-4 text-brand-green" />}
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {selectedRole.type === 'custom' && (
                  <div className="flex gap-3 pt-4 border-t">
                    <Button variant="outline" className="flex-1">
                      View Users
                    </Button>
                    <Button className="flex-1 bg-brand-blue hover:bg-brand-blue/90">
                      <Check className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <UserCog className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Role Selected</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Select a role from the list to view and manage its permissions
                </p>
                {canCreateCustomRoles && (
                  <Button
                    className="bg-brand-blue hover:bg-brand-blue/90"
                    onClick={() => setIsCreatingRole(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Custom Role
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
