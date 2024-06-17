import { Type } from 'class-transformer';
import { IsDefined, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCourseDto {
  @IsDefined()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDefined()
  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  subcategory?: string;

  @IsDefined()
  @Type(() => Number)
  @IsNumber()
  price: string;

  @IsDefined()
  @IsString()
  currency: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
