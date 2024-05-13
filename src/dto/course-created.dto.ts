import { IsDefined, IsNumber, IsOptional, IsString } from 'class-validator';

export class CourseCreatedDto {
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
  imageUrl: string;

  @IsDefined()
  @IsNumber()
  userId: number;
}
