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

}