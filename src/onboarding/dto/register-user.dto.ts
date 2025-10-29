import { 
    IsEmail, 
    IsNotEmpty, 
    IsOptional, 
    IsString, 
    MinLength } from "class-validator";
import { RoleType } from "src/interfaces/db.enums";

export class RegisterDto{
    @IsNotEmpty({message: 'Please provide first Name'})
    @IsString()
    @MinLength(3, {message: 'first name should be at least 3 characters'})
    firstName: string;

    @IsNotEmpty({message: 'Please provide last name'})
    @IsString()
    @MinLength(3, {message: 'last name should be at least 3 characters'})
    lastName: string;

    @IsOptional()
    role: RoleType;

    @IsNotEmpty({message: 'Please provide your email'})
    @IsEmail({},{message: 'Please provide a valid email'})
    email: string;

    @IsNotEmpty()
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