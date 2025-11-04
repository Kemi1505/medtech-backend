import { ArrayNotEmpty, IsArray, IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from "class-validator";
import { AdminPermission } from "src/interfaces/db.enums";

export class InviteAdminDto{
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

    @ArrayNotEmpty({message: "Admins must have at least one permission"})
    @IsArray({message: "Permissions should be in an array"})
    @IsEnum(AdminPermission, {
        each:true,
        message: 'Choose from available Permissions'})
    adminPermission: AdminPermission[];
}