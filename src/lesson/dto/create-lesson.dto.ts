import {
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
} from 'class-validator';

export class CreateLessonDto {
  @IsDefined()
  @IsUUID()
  moduleId: string;

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
  @IsUrl()
  videoUrl: string;

  @IsDefined()
  @IsNumber()
  userId: number;
}
