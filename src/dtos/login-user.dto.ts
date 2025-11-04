import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginDto {
    @IsNotEmpty({message: 'Please provide your email'})
    @IsEmail({},{message: 'Please provide a valid email'})
    email: string

    @IsNotEmpty({message: 'Please provide your password'})
    @IsString()
    @MinLength(6, {message: 'password should be at least 6 characters'})
    password: string

} 