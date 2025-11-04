import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { AdminPermission, RoleType } from '../../interfaces/db.enums';

export const Role = (arg: RoleType[]) => SetMetadata('role', arg);
export const AdminPermissions = (arg: AdminPermission) =>
  SetMetadata('adminPermissions', arg);

export const UserAgent = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers['user-agent'];
  },
);
