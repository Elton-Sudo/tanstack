import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, Roles, RolesGuard } from '@app/auth';
import {
  BulkCreateUserDto,
  ChangeUserRoleDto,
  CreateUserDto,
  InviteUserDto,
  ResetUserPasswordDto,
  UpdateUserDto,
  UserRole,
  UserSearchDto,
} from '../dto/user.dto';
import { UserService } from '../services/user.service';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async create(@Body() createUserDto: CreateUserDto, @Req() req: any) {
    const tenantId = req.user.tenantId;
    const createdBy = req.user.userId;

    // Ensure non-super-admins can only create users in their tenant
    if (req.user.role !== UserRole.SUPER_ADMIN) {
      createUserDto.tenantId = tenantId;
    }

    return this.userService.create(createUserDto, createdBy);
  }

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Get all users with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  async findAll(
    @Req() req: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query() searchDto?: UserSearchDto,
  ) {
    const tenantId = req.user.tenantId;

    // Super admin can query all tenants or specific tenant
    const queryTenantId =
      req.user.role === UserRole.SUPER_ADMIN && req.query.tenantId ? req.query.tenantId : tenantId;

    return this.userService.findAll(queryTenantId, page, limit, searchDto);
  }

  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string, @Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.userService.findOne(id, tenantId);
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Req() req: any) {
    const tenantId = req.user.tenantId;
    const updatedBy = req.user.userId;
    return this.userService.update(id, tenantId, updateUserDto, updatedBy);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN)
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 403, description: 'Cannot delete super admin' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async delete(@Param('id') id: string, @Req() req: any) {
    const tenantId = req.user.tenantId;
    const deletedBy = req.user.userId;
    await this.userService.delete(id, tenantId, deletedBy);
    return { message: 'User deleted successfully' };
  }

  @Post('invite')
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Invite a new user' })
  @ApiResponse({ status: 201, description: 'Invitation sent successfully' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async invite(@Body() inviteUserDto: InviteUserDto, @Req() req: any) {
    const tenantId = req.user.tenantId;
    const invitedBy = req.user.userId;
    return this.userService.inviteUser(inviteUserDto, tenantId, invitedBy);
  }

  @Post('bulk')
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN)
  @ApiOperation({ summary: 'Bulk create users' })
  @ApiResponse({ status: 201, description: 'Bulk user creation completed' })
  async bulkCreate(@Body() bulkCreateUserDto: BulkCreateUserDto, @Req() req: any) {
    const createdBy = req.user.userId;
    return this.userService.bulkCreate(bulkCreateUserDto.users, createdBy);
  }

  @Patch(':id/role')
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN)
  @ApiOperation({ summary: 'Change user role' })
  @ApiResponse({ status: 200, description: 'User role changed successfully' })
  @ApiResponse({ status: 403, description: 'Cannot change super admin role' })
  async changeRole(
    @Param('id') id: string,
    @Body() changeRoleDto: ChangeUserRoleDto,
    @Req() req: any,
  ) {
    const tenantId = req.user.tenantId;
    const changedBy = req.user.userId;
    return this.userService.changeRole(id, tenantId, changeRoleDto, changedBy);
  }

  @Post(':id/reset-password')
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN)
  @ApiOperation({ summary: 'Reset user password' })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  async resetPassword(
    @Param('id') id: string,
    @Body() resetPasswordDto: ResetUserPasswordDto,
    @Req() req: any,
  ) {
    const tenantId = req.user.tenantId;
    const resetBy = req.user.userId;
    return this.userService.resetPassword(id, tenantId, resetPasswordDto, resetBy);
  }

  @Get(':id/activity')
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Get user activity history' })
  @ApiResponse({ status: 200, description: 'Activity retrieved successfully' })
  async getUserActivity(@Param('id') id: string, @Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.userService.getUserActivity(id, tenantId);
  }

  @Get('export/csv')
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN)
  @ApiOperation({ summary: 'Export users to CSV' })
  @ApiResponse({ status: 200, description: 'Users exported successfully' })
  async exportUsers(@Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.userService.exportUsers(tenantId);
  }
}
