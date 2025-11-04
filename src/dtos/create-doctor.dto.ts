import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateDoctorOrAdminDto{
    @IsNotEmpty({message: 'Provide your phone number'})
    @IsString()
    phoneNumber: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6, {message: 'password should be at least 6 characters'})
    password: string;

    @IsNotEmpty()
    @IsString()
    confirmPassword: string;
}