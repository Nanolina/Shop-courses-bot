import { IsDefined, IsNumber, IsUUID } from 'class-validator';

export class DeleteCourseDto {
  @IsDefined()
  @IsUUID()
  courseId: string;

  @IsDefined()
  @IsNumber()
  userId: number;
}
