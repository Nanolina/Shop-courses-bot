import {
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
} from 'class-validator';

export class UpdateCourseDto {
  @IsDefined()
  @IsUUID()
  courseId: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  subcategory?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  walletAddressSeller?: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsDefined()
  @IsNumber()
  userId: number;
}
