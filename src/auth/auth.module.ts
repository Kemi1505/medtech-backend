import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthToken } from 'src/database/entity/user/auth.token';
import { User } from 'src/database/entity/user/user';
import { UserAuth } from 'src/database/entity/user/user.auth';
import { AuthService, MockRedisCacheService } from './auth.service';
import { AuthorizationMiddleware } from './authorization.middleware';
import { RedisCacheService } from 'src/cache/redis.cache.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([AuthToken, UserAuth, User]),
    ConfigModule
  ],
  controllers: [],
  providers: [AuthService, AuthorizationMiddleware, 
    {
      provide: RedisCacheService,
      useClass: process.env.REDIS_ENABLED === 'true'?
      RedisCacheService : MockRedisCacheService
    }],
  exports: [AuthService, AuthorizationMiddleware],
})
export class AuthModule {}