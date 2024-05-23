import { IsDefined, IsNumber, IsUUID } from 'class-validator';

export class DeleteLessonDto {
  @IsDefined()
  @IsUUID()
  lessonId: string;

  @IsDefined()
  @IsNumber()
  userId: number;
}
