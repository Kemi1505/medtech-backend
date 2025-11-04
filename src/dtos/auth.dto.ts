import { AdminPermission, AuthMethod, RoleType } from 'src/interfaces/db.enums';

export interface JwtData {
  userId: string;
  roleType: RoleType;
  authMethod: AuthMethod;
  iat?: number;
  exp?: number;
}

export interface AdminJwtData {
  userId: string;
  roleType: RoleType.ADMIN;
  permissions: AdminPermission[];
  iat?: number;
  exp?: number;
}
