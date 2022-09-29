import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./CreateUserDto";
import { IsString, IsNumber } from 'class-validator';

export class UpdateUserProfileDto {
    @IsString()
    firstName?: string

    @IsString()
    lastName?: string
}