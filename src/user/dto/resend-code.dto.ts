import { IsDefined, IsString } from 'class-validator';

export class ResendCodeDto {
  @IsDefined()
  @IsString()
  email: string;
}
