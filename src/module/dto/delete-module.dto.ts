import { IsDefined, IsNumber, IsUUID } from 'class-validator';

export class DeleteModuleDto {
  @IsDefined()
  @IsUUID()
  moduleId: string;

  @IsDefined()
  @IsNumber()
  userId: number;
}
