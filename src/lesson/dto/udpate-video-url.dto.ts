import { IsOptional, IsString } from 'class-validator';

export class UpdateVideoUrlDto {
  @IsOptional()
  @IsString()
  videoUrl?: string;
}
