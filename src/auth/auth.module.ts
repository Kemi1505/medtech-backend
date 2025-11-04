import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthToken } from 'src/database/entity/user/auth.token';
import { User } from 'src/database/entity/user/user';
import { UserAuth } from 'src/database/entity/user/user.auth';
import { AuthService } from './auth.service';
import { AuthorizationMiddleware } from './authorization.middleware';
import { RedisCacheService } from 'src/cache/redis.cache.service';
import { JwtService } from '@nestjs/jwt';
import { GoogleStrategy } from 'src/helpers/googleStrategy';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      AuthToken, 
      UserAuth, 
      User]),
    ConfigModule
  ],
  controllers: [],
  providers: [
    AuthService, 
    AuthorizationMiddleware,
    GoogleStrategy,
    JwtService,
    RedisCacheService],
  exports: [AuthService, AuthorizationMiddleware],
})
export class AuthModule {}