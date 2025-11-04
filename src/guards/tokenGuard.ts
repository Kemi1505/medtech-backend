import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import * as jwt from 'jsonwebtoken'
import { Request } from 'express';
import { config } from "src/constants/settings";

@Injectable()
export class TokenGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);
    if (!token) throw new UnauthorizedException('Token Missing, Log in to access this');

    try {
      const secret = Buffer.from(config.secretKey, 'base64').toString();
      const payload = jwt.verify(token, secret);
      request.user = payload; // attach info to request
      return true;
    } catch (error) {
      throw new UnauthorizedException('Token is invalid or expired, Log in again');
    }
  }

  private extractToken(request: Request): string | null {
  // Check for Authorization header first
  const authHeader = request.headers.authorization;
  if (authHeader) {
    const [type, token] = authHeader.split(' ');
    if (type === 'Bearer' && token) return token;
  }
  if (request.cookies && request.cookies.Auth) {
    return request.cookies.Auth;
  }
  return null;
}

}
