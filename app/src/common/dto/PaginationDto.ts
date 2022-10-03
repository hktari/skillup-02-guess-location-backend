import { IsNumber } from 'class-validator';
export class PaginationDto {
  @IsNumber()
  startIdx: number;

  @IsNumber()
  pageSize: number;
}
