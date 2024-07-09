import { IsDefined, IsEmail, IsUUID, Validate } from 'class-validator';
import { IsValidCodeConstraint } from '../validators';

export class CodeDto {
  @IsEmail()
  email: string;

  @IsDefined()
  @Validate(IsValidCodeConstraint)
  code: number;
}
