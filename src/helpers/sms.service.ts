import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { PhoneService } from './phone.service';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly apiKey?: string;
  private readonly senderId?: string;
  private readonly baseUrl?: string;

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('SENDCHAMP_API_KEY');
    this.senderId = this.configService.get<string>('SENDCHAMP_SENDER_ID');
    this.baseUrl = this.configService.get<string>('SENDCHAMP_BASE_URL');

    if (!this.apiKey || !this.senderId || !this.baseUrl) {
      this.logger.warn('SendChamp credentials not found. Test SMS will be sent.');
    } else {
      this.logger.log('SendChamp initialized');
    }
  }

  async sendOtp(phoneNumber: string, otp: string) {
    if (!phoneNumber || !otp) {
      throw new NotFoundException('Provide PhoneNumber or Otp');
    }

    const sendchampNumber = PhoneService.formatPhoneNumber(phoneNumber)
    console.log(`Sending ${otp} to ${sendchampNumber}`);
    const message = `Your verification code is: ${otp}.Verify Now, This code will expire in 5 minutes.`;

    if (!this.apiKey || !this.senderId) {
      this.logger.log(`TEST SMS: Sending OTP ${otp} to ${sendchampNumber}`);
      return { success: true, message: 'Test SMS sent successfully' };
    }

    try {
      const url = `${this.baseUrl}/sms/send`;

      const headers = {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };

      const data = {
        to: sendchampNumber,
        message: message,
        sender_name: this.senderId,
        route: 'dnd', // dnd for otps
      };

      const response = await axios.post(url, data, { headers });

      this.logger.log(`OTP sent successfully to ${sendchampNumber}. Status: ${response.data.status}`);
      return { success: true, message: 'OTP sent successfully' };

    } catch (error) {
      this.logger.error(`Failed to send OTP to ${sendchampNumber}:`, error);
      throw new BadRequestException("Otp failed to send");
    }
  }
}
