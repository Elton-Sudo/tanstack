import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return false;
    }

    // Super admin can access all tenants
    if (user.role === 'SUPER_ADMIN') {
      return true;
    }

    // Extract tenantId from request (params, body, or query)
    const tenantId = request.params.tenantId || request.body.tenantId || request.query.tenantId;

    // If no tenantId in request, use user's tenantId
    if (!tenantId) {
      return true;
    }

    // Check if user belongs to the requested tenant
    return user.tenantId === tenantId;
  }
}
