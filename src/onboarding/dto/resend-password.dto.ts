import {IsEmail, IsNotEmpty, IsString, Length, MinLength,} from "class-validator";

export class ForgotPasswordDto {
    @IsNotEmpty({message: 'Please provide your email'})
    @IsEmail({},{message: 'Please provide a valid email'})
    email: string
} 

export class ResetPasswordDto {
    @IsNotEmpty({message: 'Please provide your email'})
    @IsEmail({},{message: 'Please provide a valid email'})
    email: string

    @IsNotEmpty({message: 'Please provide the password token sent to your mail'})
    @IsString()
    passwordToken: string;

    @IsNotEmpty({message: 'Input your password'})
    @IsString()
    @MinLength(6, {message: 'password should be at least 6 characters'})
    password: string;
    
    @IsNotEmpty({message: 'Confirm your password'})
    @IsString()
    confirmPassword: string;
} 