import { IsDefined, IsOptional, IsString } from 'class-validator';

export class CreateModuleDto {
  @IsDefined()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDefined()
  @IsString()
  courseId: string;

  //   @IsDefined()
  //   @IsNumber()
  //   userId: number;
}
