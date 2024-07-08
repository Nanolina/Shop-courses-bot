import {
  IsBoolean,
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Validate,
} from 'class-validator';
import { DeployType, LanguageType } from 'types';
import { IsValidDeployTypeConstraint } from '../validators';

export class MonitorContractDto {
  @IsDefined()
  @IsString()
  contractAddress: string;

  @IsDefined()
  @IsNumber()
  initialBalance: number;

  @IsDefined()
  @IsUUID()
  @IsString()
  courseId: string;

  @IsDefined()
  @IsBoolean()
  hasAcceptedTerms: boolean;

  @IsOptional()
  @Validate(IsValidDeployTypeConstraint)
  type?: DeployType;

  @IsOptional()
  @IsString()
  language?: LanguageType;
}
