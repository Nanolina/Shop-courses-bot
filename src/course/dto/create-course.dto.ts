import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

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
  price: number;

  @IsDefined()
  @IsString()
  currency: string;

  @IsDefined()
  @IsString()
  walletAddressSeller: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}
