import { IsDefined, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateModuleDto {
  @IsDefined()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}
