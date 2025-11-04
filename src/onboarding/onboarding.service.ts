import { BadRequestException, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/database/entity/user/user";
import { EncryptionService } from "src/helpers/encryption.service";
import { Repository } from "typeorm";
import { RegisterDto } from "src/dtos/register-user.dto";
import { LoginDto } from "src/dtos/login-user.dto";
import { AuthMethod, RoleType } from "src/interfaces/db.enums";
import { AuthService } from "src/auth/auth.service";
import { OtpService } from "./otp.service";
import { ForgotPasswordDto, ResetPasswordDto } from "src/dtos/resend-password.dto";
import { randomBytes } from "crypto";
import { Auth_Password } from "src/database/entity/user/auth_password";
import { EmailService } from "src/helpers/email.service";

export class OnboardingService{
    constructor(
        //private readonly logger: Logger,
        private readonly authService: AuthService,
        private readonly otpService: OtpService,
        private readonly emailService: EmailService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Auth_Password)
        private readonly passwordRepository: Repository<Auth_Password>
    ){}

    async registerUser(registerDto: RegisterDto){
        const {email, phoneNumber,confirmPassword,firstName,lastName} = registerDto
        const user = await this.userRepository.findOne({where: {email}})
        if(user){
            throw new BadRequestException('user with email exists')
        }
        const phone = await this.userRepository.findOne({where: {phoneNumber}})
        if(phone){
            throw new BadRequestException('user with phone number exists')
        }
        if(registerDto.password !== confirmPassword){
            throw new BadRequestException('password must match')
        }
        const password = await EncryptionService.hash(registerDto.password)

        const newUser = this.userRepository.create({email, phoneNumber,password,firstName,lastName})

        const savedUser = await this.userRepository.save(newUser)

        const response = await this.otpService.generateOtp(phoneNumber)

        return{
            message: 'Signed Up successfully',
            response,
            savedUser
        } 
    }

    async login(loginDto: LoginDto){
        const{email, password} = loginDto;

        const user = await this.userRepository.findOne({where: {email}})
        if(!user){
            throw new NotFoundException("User not found, please sign up")
        }
        const hashedPassword = await EncryptionService.hash(password)
        if(hashedPassword !== user.password){
            throw new BadRequestException('Invalid password')
        }
        if(!user.phoneVerified && user.authType!== 'GOOGLE'){
            await this.otpService.generateOtp(user.phoneNumber)
            throw new BadRequestException('Otp has been sent to your number, verify first')
        }
        const userId = user.id
        const role = user.role as RoleType
        const accessToken = await this.authService.generateUserToken(userId, role)
        return {
            message:'Login successful',
            accessToken,
            user
        }
    }

    async sendPasswordToken(forgotPasswordDto: ForgotPasswordDto){
        const existingUser = await this.userRepository.findOne({where: {email: forgotPasswordDto.email}})
        if(!existingUser){
            throw new NotFoundException('No user with this email')
        }
        const passwordToken = randomBytes(8).toString('hex')
        const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000) //1hr

        const existingToken = await this.passwordRepository.findOne({where: {userId: existingUser.id}})
        if(existingToken){
            existingToken.passwordToken = passwordToken
            existingToken.expiresAt = expiresAt
            await this.passwordRepository.save(existingToken)
        }else{
            await this.passwordRepository.save({
            userId: existingUser.id,
            passwordToken,
            expiresAt,
        })
        }
        await this.emailService.sendPasswordToken(forgotPasswordDto.email, passwordToken)
        return{
            message: `Token ${passwordToken} successfully sent to ${forgotPasswordDto.email}`
        }
    }
    
    async verifyPasswordToken(passwordToken: string){
        const token = await this.passwordRepository.findOne({where: {passwordToken}})
        if(!token || !token.expiresAt || new Date() > token.expiresAt){
            throw new BadRequestException('Invalid or Expired Token');
        }
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto){
        const user = await this.userRepository.findOne({ where: { email: resetPasswordDto.email } });
        if (!user) throw new NotFoundException('No User with this email');

        const pass = await this.passwordRepository.findOne({where: {userId: user.id}})
        if(!pass) throw new NotFoundException('No password Token for this User')

        if (pass.passwordToken !== resetPasswordDto.passwordToken
            || !pass.expiresAt || new Date() > pass.expiresAt) {
        throw new BadRequestException('Invalid or Expired Token');
        }

        if(resetPasswordDto.password !== resetPasswordDto.confirmPassword){
            throw new BadRequestException('Password must match')
        }

        user.password = await EncryptionService.hash(resetPasswordDto.password)
        pass.passwordToken = null;
        pass.expiresAt = null;

        await this.userRepository.save(user);
        await this.passwordRepository.save(pass);

        return{
            message: 'Password successfully changed'
        }
    }

    async validateGoogleUser(details: Partial<RegisterDto>){
        let user = await this.userRepository.findOne({where: {email: details.email}})
        
        if (!user){
            const authType = AuthMethod.GOOGLE;
            const emailVerified = true;
             user = this.userRepository.create({
                ...details,authType,emailVerified
            })     
        }
        user = await this.userRepository.save(user)
        return user;
    }
}
