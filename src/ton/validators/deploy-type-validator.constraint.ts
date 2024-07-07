import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { DeployEnum } from 'types';

@ValidatorConstraint({ name: 'isValidDeployType', async: false })
export class IsValidDeployTypeConstraint
  implements ValidatorConstraintInterface
{
  validate(deployType: any) {
    if (deployType === '') return true;
    const deployTypeValues = Object.values(DeployEnum) as string[];
    return (
      typeof deployType === 'string' && deployTypeValues.includes(deployType)
    );
  }

  defaultMessage() {
    return 'The deployType is incorrect';
  }
}
