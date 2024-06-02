import { IsDefined, IsOptional, IsString } from 'class-validator';

export class CreateModuleDto {
  @IsDefined()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
