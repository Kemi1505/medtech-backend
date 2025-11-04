import { 
    Controller, 
    Body, 
    Get, 
    Post, 
    Query, 
    Req, 
    Res, 
    UseGuards } from "@nestjs/common";
import { OnboardingService } from "./onboarding.service";
import { LoginDto } from "src/dtos/login-user.dto";
import type { Request,Response } from "express";
import { AuthService } from "src/auth/auth.service";
import { OtpService } from "./otp.service";
import { RoleType } from "src/interfaces/db.enums";
import { Role } from "src/auth/roles/roles.decorator";
import { InviteDoctorDto } from "src/dtos/invite-doctor";
import { ReqBody } from "src/interfaces/request.body";
import { InviteAdminDto } from "src/dtos/invite-admin";
import {  CreateDoctorOrAdminDto } from "src/dtos/create-doctor.dto";
import { ForgotPasswordDto, ResetPasswordDto } from "src/dtos/resend-password.dto";
import { TokenGuard } from "src/guards/tokenGuard";
import { RegisterDto } from "src/dtos/register-user.dto";
import { VerifyDto } from "src/dtos/verify-otp.dto";
import { ResendDto } from "src/dtos/resend-otp.dto";
import { RoleGuard } from "src/auth/roles/role/role.guard";
import { InviteService } from "./invite.service";
import { GoogleAuthGuard } from "src/guards/googleGuard";

@Controller()
export class OnboardingController{
    constructor(
        private readonly onboardingService: OnboardingService,
        private readonly authService: AuthService,
        private readonly otpService: OtpService, 
        private readonly inviteService: InviteService,    
    ) {}
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

    @Post('send-passwordToken')
    async sendPasswordtoken(@Body() forgotPasswordDto: ForgotPasswordDto){
        return await this.onboardingService.sendPasswordToken(forgotPasswordDto)
    }

    @Post('reset-password')
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto){
        return await this.onboardingService.resetPassword(resetPasswordDto)
    }

    @Get('google/login')
    @UseGuards(GoogleAuthGuard)
    handleLogin() {
        return {
            msg: 'Redirecting to google...'}
    }

    @Get('google/redirect')
    @UseGuards(GoogleAuthGuard)
    async handleredirect(@Req() request: Request, @Res() response: Response) {
        const user = request.user as ReqBody;
        const userId = user.userId;
        const accessToken = await this.authService.generateUserToken(userId, RoleType.USER)
        this.authService.setCookie(response, accessToken)
        return {
            msg: 'Login',
            accessToken,
            user
        }
    }

    @UseGuards(TokenGuard,RoleGuard)
    @Role([RoleType.ADMIN,RoleType.SUPER_ADMIN])
    @Post('invite-doctor')    
    async inviteDoctor(@Body() inviteDoctorDto: InviteDoctorDto, @Req() request: Request){
        const inviter = request.user as ReqBody
        const invitedBy = inviter.userId
        return await this.inviteService.inviteDoctor(inviteDoctorDto, invitedBy)
    }

    @UseGuards(TokenGuard, RoleGuard)
    @Role([RoleType.SUPER_ADMIN])
    @Post('invite-admin')
    async inviteAdmin(@Body() inviteAdminDto: InviteAdminDto, @Req() request: Request){
        const inviter = request.user as ReqBody
        const invitedBy = inviter.userId
        return await this.inviteService.inviteAdmin(inviteAdminDto, invitedBy)
    }

    @Post('create-doctor')
    async createDoctor(@Query('token') token: string, @Body() createDoctorDto: CreateDoctorOrAdminDto){
        const verify = await this.inviteService.verifyToken(token)
        if (verify === true){
            return await this.inviteService.createDoctor(createDoctorDto, token)
        }

    }

    @Post('create-admin')
    async createAdmin(@Query('token') token: string, @Body() createAdminDto: CreateDoctorOrAdminDto){
        const verify = await this.inviteService.verifyToken(token)
        if (verify === true){
            return await this.inviteService.createAdmin(createAdminDto, token)
        }
    }

    @Get('dashboard')
    @UseGuards(TokenGuard)
    dash(){
        return{
            msg: "you have reached dashboard"
        }
    }
}
