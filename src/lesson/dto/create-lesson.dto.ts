import { IsDefined, IsOptional, IsString } from 'class-validator';

export class CreateLessonDto {
  @IsDefined()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
