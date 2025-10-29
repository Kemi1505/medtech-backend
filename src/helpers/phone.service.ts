import { BadRequestException } from '@nestjs/common';
import { CountryCodes } from 'src/interfaces/db.enums';

export class PhoneService {
  static formatPhoneNumber(phoneNumber: string): string {
    if (!phoneNumber) {
      throw new BadRequestException('Phone number is required');
    }

    // Remove all spaces or hyphens
    phoneNumber = phoneNumber.replace(/\s|-/g, '');

    // Remove leading "+" if present (to simplify detection)
    if (phoneNumber.startsWith('+')) {
      phoneNumber = phoneNumber.slice(1);
    }

    //Check if it already starts with a known country code
    const countryCode = Object.values(CountryCodes).find((code) =>
      phoneNumber.startsWith(code),
    );

    if (countryCode) {
      // Remove the country code and ensure no leading zero
      let nationalNumber = phoneNumber.slice(countryCode.length);
      if (nationalNumber.startsWith('0')) {
        nationalNumber = nationalNumber.slice(1);
      }
      return `${countryCode}${nationalNumber}`;
    }

    // Default to Nigeria if no known code detected
    const defaultCode = CountryCodes.Nigeria;

    // Validate Nigerian number (must be 11 digits and start with 0)
    if (!/^0[789]\d{9}$/.test(phoneNumber)) {
      throw new BadRequestException('Invalid Nigerian number format');
    }

    // Remove leading 0 and prepend +234
    return `${defaultCode}${phoneNumber.slice(1)}`;
  }
}