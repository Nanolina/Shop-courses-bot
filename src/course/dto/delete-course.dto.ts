import { IsDefined, IsNumber, IsUUID } from 'class-validator';

export class DeleteCourseDto {
  @IsDefined()
  @IsUUID()
  id: string;

  @IsDefined()
  @IsNumber()
  userId: number;
}
