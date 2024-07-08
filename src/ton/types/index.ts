import { DeployType, LanguageType } from 'types';

export type HandleBalanceIncreaseType = {
  userId: number;
  courseId: string;
  type: DeployType;
  language: LanguageType;
  hasAcceptedTerms: boolean;
  balance: number;
};
