import { IsString, IsNumber } from 'class-validator';

class CreateLocationDto {
  @IsString()
  address: string;

  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;

  @IsString()
  imageBase64: string;
}

export default CreateLocationDto;
