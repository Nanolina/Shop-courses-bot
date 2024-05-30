import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateLessonDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsUrl()
  videoUrl?: string;
}
