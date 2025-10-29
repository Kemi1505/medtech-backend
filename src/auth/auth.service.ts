import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotImplementedException,
} from '@nestjs/common';
import { JwtData } from './auth.dto';
import * as jwt from 'jsonwebtoken';
import { AuthMethod, RoleType } from 'src/interfaces/db.enums';
import { config, USER_TOKEN_EXPIRY_IN_SECONDS } from '../constants/settings';
import { EncryptionService } from 'src/helpers/encryption.service';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthToken } from 'src/database/entity/user/auth.token';
import { Repository } from 'typeorm';
import { RedisCacheService } from 'src/cache/redis.cache.service';
import { cookieConfig} from 'src/config/token.config';
import { Response } from 'express';

@Injectable()
export class MockRedisCacheService {
  private readonly logger = new Logger(MockRedisCacheService.name);

  async setEntityToken(...args: any[]) {
    this.logger.log('Mock setEntityToken called');
    return;
  }
}
export class AuthService {
  private readonly encryptionKey: string;
  private readonly tokenGenerationException: HttpException;
  private readonly logger = new Logger(AuthService.name)
  constructor(
    //private readonly logger: Logger,
    private readonly redisCacheService: RedisCacheService,
    @InjectRepository(AuthToken)
    private readonly userAuthTokenRepository: Repository<AuthToken>,
  ) {
    this.encryptionKey = Buffer.from(config.secretKey, 'base64').toString();
    this.tokenGenerationException = new InternalServerErrorException(
      'Sorry, we couldn\t log you in. Please contact support if error persists.',
    );
  }

  async logoutUser() {
    return 'User signed out successfully'
  }

  async generateUserToken(userId: string, userRole: RoleType): Promise<string> {
    const expiresAt = new Date(
      Date.now() + USER_TOKEN_EXPIRY_IN_SECONDS * 1000,
    );

    const userToken = await this.generateToken(
      {
        userId,
        roleType: userRole,
        authMethod: AuthMethod.EMAIL_AND_PASSWORD,
      },
      USER_TOKEN_EXPIRY_IN_SECONDS,
    );

    const hashedToken = await EncryptionService.hash(userToken);
    await this.userAuthTokenRepository.save({
      userId: userId,
      token: hashedToken,
      roleType: userRole,
      expiresAt,
    });

    await this.redisCacheService.setEntityToken({
      userId: userId,
      token: hashedToken,
      roleType: userRole,
      expiry: 60 * 60 * 24 * 7,
    });
    return userToken;
  }

  async generateToken(
    params: JwtData,
    expiryInSeconds: number,
  ): Promise<string> {
    const { userId, roleType } = params;
    let token;
    const options: jwt.SignOptions = {};
    if (expiryInSeconds) {
      options.expiresIn = expiryInSeconds;
    }

    try {
      if (userId) {
        token = jwt.sign(
          { userId, roleType: roleType || RoleType.USER },
          this.encryptionKey,
          options,
        );
      } else {
        this.logger.log('AuthService: No userId provided for generateToken');
        throw this.tokenGenerationException;
      }

      if (!token) {
        this.logger.log('AuthService: Token generation error');
        throw this.tokenGenerationException;
      }
      return token;
    } catch (error) {
      this.logger.log('AuthService: Error occurred while generating jwt token');
      throw this.tokenGenerationException;
    }
  }
  setCookie(res: Response, authToken: string){
      res.cookie(cookieConfig.name, authToken, cookieConfig.info)
  }

  clearCookie(res: Response){
    res.clearCookie(cookieConfig.name, cookieConfig.info)
  }
}
