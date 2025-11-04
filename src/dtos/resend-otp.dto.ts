import {IsNotEmpty, IsString, Length,} from "class-validator";

export class ResendDto {
    @IsNotEmpty({message: 'Please provide your PhoneNumber'})
    @IsString({message: 'Phone Number should be a string'})
    phoneNumber: string

} 