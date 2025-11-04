import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AdminPermission, RoleType } from 'src/interfaces/db.enums';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  matchRoles(roles: RoleType | RoleType[], userRole: RoleType) {
    if (Array.isArray(roles)) {
      return roles.includes(userRole);
    }
    return roles === userRole;

  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const role = this.reflector.get<RoleType[]>('role', context.getHandler());
    const adminPermissions = this.reflector.get<AdminPermission>(
      'adminPermissions',
      context.getHandler(),
    );

    if (!role) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user || request.admin;
    if (!user) {
      return false;
    }

    let isValid = this.matchRoles(role, user.roleType);
    if(!isValid){
      return false
    }
    if(user.roleType !== RoleType.ADMIN && user.roleType !== RoleType.SUPER_ADMIN){
      return false;
    }
    if(user.roleType === RoleType.SUPER_ADMIN){
      return true;
    }
    if(!adminPermissions){
      return true
    }

    const userPermissions = user.adminPermissions || [];

    const isAuthorized =
      adminPermissions && userPermissions.includes(adminPermissions);

    return isAuthorized;

    
  }
}
