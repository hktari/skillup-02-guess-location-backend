import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @MinLength(5)
  @IsString()
  password: string;
}
