import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy, StrategyOptions } from "passport-google-oauth20";
import { AuthService } from "src/auth/auth.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService
    ) {
        super({
            clientID: configService.get<string>('clientID'),
            clientSecret: configService.get<string>('clientSecret'),
            callbackURL: configService.get<string>('callbackURL'),
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
