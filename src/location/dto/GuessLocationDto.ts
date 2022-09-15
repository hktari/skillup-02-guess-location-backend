import { IsString, IsNumber} from 'class-validator';

export class GuessLocationDto{
    @IsString()
    address: string

    @IsNumber()
    lat: number

    @IsNumber()
    lng: number
}