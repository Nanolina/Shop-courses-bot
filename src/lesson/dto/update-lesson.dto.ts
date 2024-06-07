import { Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateLessonDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  // Image
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isRemoveImage?: string;

  // Video
  @IsOptional()
  @IsString()
  videoUrl?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isRemoveVideo?: string;
}
