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

  @IsDefined()
  @IsNumber()
  userId: number;
}
