import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy, StrategyOptions } from "passport-google-oauth20";
import { OnboardingService } from "src/onboarding/onboarding.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly onboardingService: OnboardingService,
        private readonly configService: ConfigService
    ) {
        super({
            clientID: configService.get<string>('clientID'),
            clientSecret: configService.get<string>('clientSecret'),
            callbackURL: configService.get<string>('callbackURL'),
            scope: ['profile', 'email'],
            passReqToCallback: false
        } as StrategyOptions)
    }

    async validate( profile: Profile){
        const { name, emails } = profile;
        const user = {
            email: emails?.[0]?.value,
            firstName: name?.givenName,
            lastName: name?.familyName,
        };
        const validatedUser = await this.onboardingService.validateGoogleUser(user);
        return validatedUser
    }
}


