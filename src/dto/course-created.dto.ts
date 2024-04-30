import {
  IsDefined,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

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
  @IsNumberString()
  price: string;

  @IsDefined()
  @IsString()
  currency: string;

  @IsDefined()
  @IsNumberString()
  userId: string;

  @IsOptional()
  @IsString()
  userName?: string;
}
