import { IsOptional, IsString } from 'class-validator';

export class UpdateModuleDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  //   @IsDefined()
  //   @IsNumber()
  //   userId: number;
}
