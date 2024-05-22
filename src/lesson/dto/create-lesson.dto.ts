import { IsDefined, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateLessonDto {
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
}
