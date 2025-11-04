import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { OtpService } from "src/onboarding/otp.service";
import { User } from "src/database/entity/user/user";
import { RoleType } from "src/interfaces/db.enums";
import { EncryptionService } from "./encryption.service";

@Injectable()
export class SuperAdminService{
    constructor(
        private otpService: OtpService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ){}

    //Only one super admin in database
    async isSuperAdmin(){
        const existingSuperAdmin = await this.userRepository.findOne({where: {role: RoleType.SUPER_ADMIN}})
        if(!existingSuperAdmin){
            await this.createOneAdmin()
        }
        return
    }

    async createOneAdmin(){
        const email = process.env.SUPER_ADMIN_EMAIL
        const phoneNumber = process.env.SUPER_ADMIN_NUMBER as string
        const password = process.env.SUPER_ADMIN_PASSWORD as string
        const hashedPassword = await EncryptionService.hash(password)

        const superAdmin = this.userRepository.create({
            firstName: 'super',
            lastName: 'Admin',
            email,
            phoneNumber,
            password: hashedPassword,
            role: RoleType.SUPER_ADMIN
        })
        await this.userRepository.save(superAdmin)
        await this.otpService.generateOtp(phoneNumber)
        console.log('Super admin created')
        return{
            message: 'SuperAdmin successfully  created'
        }
    }
}