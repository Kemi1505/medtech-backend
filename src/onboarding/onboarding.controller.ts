import { Body, Controller, Get, Post, Res, UseGuards } from "@nestjs/common";
import { OnboardingService } from "./onboarding.service";
import { RegisterDto } from "./dto/register-user.dto";
import { LoginDto } from "./dto/login-user.dto";
import type { Response } from "express";
import { AuthService } from "src/auth/auth.service";
import { VerifyDto } from "./dto/verify-otp.dto";
import { OtpService } from "./otp.service";
import { ResendDto } from "./dto/resend-otp.dto";

@Controller()
export class OnboardingController{
    constructor(
        private readonly onboardingService: OnboardingService,
        private readonly authService: AuthService,
        private readonly otpService: OtpService ) {}
    @Post('signup')
    async register(@Body() registerDto: RegisterDto) {
        return await this.onboardingService.registerUser(registerDto)
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
        const response = await this.onboardingService.login(loginDto)

        const accessToken = response.accessToken;
        this.authService.setCookie(res, accessToken)
        return response;
    }

    @Post('logout')
    async logout(@Res({ passthrough: true }) res: Response) {
        this.authService.clearCookie(res);
        return await this.authService.logoutUser()
    }

    @Post('verify-otp')
    async verifyOtp(@Body() verifyDto: VerifyDto){
        return await this.otpService.verifyOtp(verifyDto.phoneNumber, verifyDto.otp)
    }

    @Post('resend-otp')
    async resendOtp(@Body() resendDto: ResendDto){
        return await this.otpService.resendOtp(resendDto.phoneNumber)
    }

}