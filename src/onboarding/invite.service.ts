import { 
    BadGatewayException, 
    BadRequestException, 
    Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { randomBytes } from "crypto";
import { User } from "src/database/entity/user/user";
import { InviteToken } from "src/database/entity/user/invite.token";
import { EmailService } from "src/helpers/email.service";
import { EncryptionService } from "src/helpers/encryption.service";
import { RoleType } from "src/interfaces/db.enums";
import { CreateDoctorOrAdminDto } from "src/dtos/create-doctor.dto";
import { InviteAdminDto } from "src/dtos/invite-admin";
import { InviteDoctorDto } from "src/dtos/invite-doctor";
import { OtpService } from "src/onboarding/otp.service";
import { Repository } from "typeorm";

@Injectable()
export class InviteService{
    constructor(
        private readonly emailService: EmailService,
        private readonly otpService: OtpService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(InviteToken)
        private readonly inviteRepository: Repository<InviteToken>
    ){}
    
    async inviteDoctor(inviteDoctorDto: InviteDoctorDto, invitedBy: string){
        const inviteToken = randomBytes(8).toString('hex')
        const expiresAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) //3 days
        const {email, department, firstName, lastName} = inviteDoctorDto
        const isUsed = false;

        const invite = this.inviteRepository.create({
            email,
            token: inviteToken,
            firstName,
            lastName,
            department,
            invitedBy,
            role: RoleType.DOCTOR,
            expiresAt,
            isUsed       
        })
        await this.emailService.sendDoctorInvite(email, firstName, inviteToken)
        await this.inviteRepository.save(invite)
        return{
            message: 'Doctors invite sent sucessfully',
            invite
        }
    }

    async inviteAdmin(inviteAdminDto: InviteAdminDto, invitedBy: string){
        const inviteToken = randomBytes(8).toString('hex')
        const expiresAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) //3 days
        const {email, adminPermission, firstName, lastName} = inviteAdminDto
        
        const invite = this.inviteRepository.create({
            email,
            token: inviteToken,
            firstName,
            lastName,
            permissions: adminPermission,
            invitedBy,
            role: RoleType.ADMIN,
            expiresAt  
        })
        await this.inviteRepository.save(invite)
        await this.emailService.sendAdminInvite(email, firstName, inviteToken)
        return{
            message: 'Admin invite sent sucessfully',
            invite
        }
    }

    async verifyToken(token: string){
        const isTokenValid = await this.inviteRepository.findOne({where: {token}})
        if(!isTokenValid || !isTokenValid.expiresAt || new Date() > isTokenValid.expiresAt){
            throw new BadRequestException('Invalid or expired token')
        }
        if(isTokenValid.isUsed){
            throw new BadRequestException('Token has been used already')
        }
            else{
            return true
        }
            
    }

    async createDoctor(createDoctorDto: CreateDoctorOrAdminDto, token: string){
        const doctor = await this.inviteRepository.findOne({where: {token}}) as InviteToken
        const {firstName, lastName,role,email } = doctor
        if(createDoctorDto.password !== createDoctorDto.confirmPassword){
            throw new BadGatewayException('Password must match')
        }
        const hashedPassword = await EncryptionService.hash(createDoctorDto.password)

        const newDoctor = this.userRepository.create({
            firstName,
            lastName,
            email,
            phoneNumber: createDoctorDto.phoneNumber,
            password: hashedPassword,
            role
        })

        doctor.isUsed = true;
        await this.inviteRepository.save(doctor)
        await this.userRepository.save(newDoctor)
        await this.otpService.generateOtp(createDoctorDto.phoneNumber)
        return{
            message: 'You have successfully signed up as a doctor'
        }
    }

    async createAdmin(createAdminDto: CreateDoctorOrAdminDto, token: string){
        const admin = await this.inviteRepository.findOne({where: {token}}) as InviteToken
        const {firstName, lastName,role,email } = admin
        const hashedPassword = await EncryptionService.hash(createAdminDto.password)
        if(createAdminDto.password !== createAdminDto.confirmPassword){
            throw new BadGatewayException('Password must match')
        }
        const newAdmin = this.userRepository.create({
            firstName,
            lastName,
            email,
            phoneNumber: createAdminDto.phoneNumber,
            password: hashedPassword,
            role
        })

        admin.isUsed = true;
        await this.inviteRepository.save(admin)
        await this.userRepository.save(newAdmin)
        await this.otpService.generateOtp(createAdminDto.phoneNumber)
        return{
            message: 'You have successfully signed up as an admin'
        }
    }
}