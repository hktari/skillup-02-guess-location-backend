import { IsString } from 'class-validator'

export class SignupDto {

    @IsString()
    email: string

    @IsString()
    password: string

    @IsString()
    firstName: string

    @IsString()
    lastName: string

    @IsString()
    imageBase64?: string
}