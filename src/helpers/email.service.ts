import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter: nodemailer.Transporter;

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('GMAIL_APP_USER'),
        pass: this.configService.get<string>('GMAIL_APP_PASSWORD'),
      },
    });
  }

  async sendPasswordToken(email: string, passwordToken: string) {
    if (!email || !passwordToken) {
      throw new NotFoundException('Email and password token not found');
    }

    const from = `"${this.configService.get('MAIL_FROM_NAME')}" <${this.configService.get('GMAIL_APP_USER')}>`;
    
    try {
      const info = await this.transporter.sendMail({
        from: from,
        to: email,
        subject: 'Password Reset Token',
        text: `This is your password token ${passwordToken},
        You can also signup and set your password at this link http://localhost:3000/reset-password?token=${passwordToken} 
        Token expires in one hour. Kindly ignore if you didn't request for this`,
      });
      
      this.logger.log(`Token sent successfully to ${email}`);
      return { 
        message: 'Token sent successfully' };
    } catch (error) {
      this.logger.error(`Failed to send token to: ${email}`, error);
      throw new BadRequestException('Failed to send token');
    }
  }

  async sendDoctorInvite(email: string,firstName: string, token: string){
    if (!email || !token || !firstName) {
      throw new NotFoundException('Email and password token not found');
    }

    const from = `"${this.configService.get('MAIL_FROM_NAME')}" <${this.configService.get('GMAIL_APP_USER')}>`;
    
    try {
      const info = await this.transporter.sendMail({
        from: from,
        to: email,
        subject: 'Invitation to be a Doctor',
        text: `Hello ${firstName} we are exited to invite you to work with us at Medtech as a doctor, 
        This is your unique token ${token} 
        You can also signup and set your password at this link http://localhost:3000/create-doctor?token=${token}
        Token expires in 3 days and can only be used once.`,
      });
      
      this.logger.log(`Invite sent successfully to ${email}`);
      return { 
        message: 'Invite sent successfully' };
    } catch (error) {
      this.logger.error(`Failed to send Invite to: ${email}`, error);
      throw new BadRequestException('Failed to send Invite');
    }
  }

  async sendAdminInvite(email: string,firstName: string, token: string){
    if (!email || !token || !firstName) {
      throw new NotFoundException('Email and password token not found');
    }

    const from = `"${this.configService.get('MAIL_FROM_NAME')}" <${this.configService.get('GMAIL_APP_USER')}>`;
    
    try {
      const info = await this.transporter.sendMail({
        from: from,
        to: email,
        subject: 'Invitation to be an Admin',
        text: `Hello ${firstName} we are exited to invite you to work with us at Medtech as an Admin, 
        This is your unique token ${token} 
        You can also signup and set your password at this link http://localhost:3000/create-admin?token=${token}
        Token expires in 3 days and can only be used once.`,
      });
      
      this.logger.log(`Invite sent successfully to ${email}`);
      return { 
        message: 'Invite sent successfully' };
    } catch (error) {
      this.logger.error(`Failed to send Invite to: ${email}`, error);
      throw new BadRequestException('Failed to send Invite');
    }
  }

}