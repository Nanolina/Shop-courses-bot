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
