import { Course } from '@prisma/client';
import { RoleType } from 'types';

export type FindOneResponse = {
  role: RoleType;
  course: Course;
};
