import { BadRequestException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Auth_Otp } from "src/database/entity/user/auth_otp";
import { User } from "src/database/entity/user/user";
import { PhoneService } from "src/helpers/phone.service";
import { SmsService } from "src/helpers/sms.service";
import { Repository } from "typeorm";

export class OtpService{
    constructor(
        private readonly smsService: SmsService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Auth_Otp)
        private readonly otpRepository: Repository<Auth_Otp>
    ){}


    async generateOtp(phoneNumber: string) {
        const newNumber = PhoneService.formatPhoneNumber(phoneNumber)

        const user = await this.userRepository.findOne({
            where: {phoneNumber}
        });
        if (!user) {
        throw new NotFoundException('User not Found');
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5min
        const userId = user.id

        const existingOtp = await this.otpRepository.findOne({where: {userId}})
        if(existingOtp){
            existingOtp.otp = otp
            existingOtp.expiresAt = expiresAt
            await this.otpRepository.save(existingOtp)
        }else{
            await this.otpRepository.save({
            userId: user.id,
            otp: otp,
            expiresAt: expiresAt,
        })
        }
        await this.smsService.sendOtp(newNumber, otp);
        return{
            message: `Otp successfully sent to ${newNumber}`
        }
    }

    async verifyOtp(phoneNumber: string, otp: string){
        const newNumber = PhoneService.formatPhoneNumber(phoneNumber)

        const user = await this.userRepository.findOne({
            where: {phoneNumber}
        });
        if (!user) {
            throw new NotFoundException('User not Found');
        }
        const userId = user.id
        const findotp = await this.otpRepository.findOne({
            where: {userId}
        })
        if(!findotp){
            throw new NotFoundException('No otp, kindly generate one')
        }

        if(findotp.otp !== otp 
            || !findotp.expiresAt || new Date() > findotp.expiresAt){
            throw new BadRequestException('Invalid or expired Otp')
        }

        user.phoneVerified = true;
        findotp.otp = null;
        findotp.expiresAt = null;
        await this.userRepository.save(user);
        await this.otpRepository.save(findotp)
        return{
            message: `${newNumber} has been successfully verified`
        }
        
    }

    async resendOtp(phoneNumber: string){
        const response = await this.generateOtp(phoneNumber)
        return response
    }
}