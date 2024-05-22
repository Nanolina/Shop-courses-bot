import {
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
} from 'class-validator';

export class CreateModuleDto {
  @IsDefined()
  @IsUUID()
  courseId: string;

  @IsDefined()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsDefined()
  @IsNumber()
  userId: number;
}
