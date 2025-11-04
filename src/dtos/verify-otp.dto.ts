import {IsNotEmpty, IsString, Length,} from "class-validator";

export class VerifyDto {
    @IsNotEmpty({message: 'Please provide your PhoneNumber'})
    @IsString({message: 'Phone Number should be a string'})
    phoneNumber: string

    @IsNotEmpty({message: 'Please provide your Otp'})
    @IsString({message: 'Otp should be a string'})
    @Length(6,6, {message: 'Otp should be exactly 6 characters'})
    otp: string
} 