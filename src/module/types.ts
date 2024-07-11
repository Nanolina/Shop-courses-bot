import { Module } from '@prisma/client';
import { RoleType } from 'types';

export type FindAllResponse = {
  role: RoleType;
  modules: Module[];
};
