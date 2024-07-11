import { Lesson } from '@prisma/client';
import { RoleType } from 'types';

export type FindAllResponse = {
  role: RoleType;
  lessons: Lesson[];
};
