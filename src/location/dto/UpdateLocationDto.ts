import CreateLocationDto from "./CreateLocationDto";
import { IsString, IsNumber } from 'class-validator'

export class UpdateLocationDto {
    @IsString()
    address: string

    @IsNumber()
    lat: number

    @IsNumber()
    lng: number

    @IsString()
    imageBase64?: string
}