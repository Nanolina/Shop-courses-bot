import { IsOptional, IsString } from 'class-validator';

export class UpdateDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;
}
