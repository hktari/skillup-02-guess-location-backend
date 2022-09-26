import { IsString, IsNumber} from 'class-validator';
import { Base64ToByteTransform } from '../../common/decorators/base64.transform';

export class CreateUserDto{
    @IsString()
    firstName:string

    @IsString()
    lastName: string

    @IsString()
    email: string

    @IsString()
    password: string

    @IsString()
    image: string

}