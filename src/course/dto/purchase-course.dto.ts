import { IsDefined, IsString } from 'class-validator';

export class PurchaseCourseDto {
  @IsDefined()
  @IsString()
  walletAddressCustomer: string;
}
