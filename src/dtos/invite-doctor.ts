import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from "class-validator";
import { Department } from "src/interfaces/db.enums";

export class InviteDoctorDto{
    @IsNotEmpty({message: "Please provide doctor's first Name"})
    @IsString()
    @MinLength(3, {message: "Doctor's name should be at least 3 characters"})
    firstName: string;

    @IsNotEmpty({message: "Please provide doctor's name"})
    @IsString()
    @MinLength(3, {message: "Doctor's name should be at least 3 characters"})
    lastName: string;

    @IsNotEmpty({message: "Please provide doctor's email"})
    @IsEmail({},{message: "Please provide a valid email"})
    email: string;

    @IsEnum(Department, {message: 'Choose from available departments'})
    department: Department;
}