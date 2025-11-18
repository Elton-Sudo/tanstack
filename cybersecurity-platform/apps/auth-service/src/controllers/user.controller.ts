import { Roles } from '@app/common';
import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @Roles('SUPER_ADMIN', 'TENANT_ADMIN')
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  async getAllUsers() {
    return { message: 'Get all users endpoint' };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  async getUserById(@Param('id') id: string) {
    return this.authService.getUserProfile(id);
  }
}
