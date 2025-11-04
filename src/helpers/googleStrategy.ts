import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy, StrategyOptions, VerifyCallback } from "passport-google-oauth20";
import { AuthService } from "src/auth/auth.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService
    ) {
        super({
            clientID: '452212230775-0l4g5s8d0oompgj255igergfpuq06jf6.apps.googleusercontent.com',
            clientSecret: configService.get<string>('clientSecret'),
            callbackURL: 'http://localhost:3000/google/redirect',
            scope: ['profile', 'email'],
        } as StrategyOptions)
    }

    async validate(accessToken: string,refreshToken: string, profile: Profile){
        const { name, emails } = profile;
        const user = {
            email: emails?.[0]?.value,
            firstName: name?.givenName,
            lastName: name?.familyName,
        };
        
        const validatedUser = await this.authService.validateGoogleUser(user);
        return validatedUser
    }
}
