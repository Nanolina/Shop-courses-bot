import {
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
} from 'class-validator';

export class UpdateModuleDto {
  @IsDefined()
  @IsUUID()
  moduleId: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsDefined()
  @IsNumber()
  userId: number;
}
