import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';

/**
 * Super Admin Guard
 * Restricts access to endpoints that should only be accessible by super administrators
 * Used for platform-wide administrative functions like certificate template management
 */
@Injectable()
export class SuperAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Authentication required');
    }

    if (user.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException(
        'This action requires super administrator privileges. Only super admins can manage certificate templates.',
      );
    }

    return true;
  }
}
