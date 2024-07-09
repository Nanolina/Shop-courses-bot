// Type
export type EntityType = 'course' | 'module' | 'lesson';
export type DeployType = 'create' | 'purchase';
export type StatusType = 'success' | 'error';
export type LanguageType = 'en' | 'ru';

// Enum
export enum StatusEnum {
  Success = 'success',
  Error = 'error',
}

export enum DeployEnum {
  Create = 'create',
  Purchase = 'purchase',
}

export type UserFromTG = {
  id: bigint;
  first_name: string;
  last_name: string;
  username: string;
  language_code: string;
};
