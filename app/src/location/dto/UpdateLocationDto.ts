import CreateLocationDto from './CreateLocationDto';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateLocationDto {
  @IsString()
  address: string;

  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;

  @IsOptional()
  @IsString()
  imageBase64?: string;
}
