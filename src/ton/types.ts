import { User } from '@tma.js/init-data-node';
import { DeployType, LanguageType } from 'types';

export type HandleBalanceIncreaseType = {
  user: User;
  courseId: string;
  type: DeployType;
  language: LanguageType;
  hasAcceptedTerms: boolean;
  balance: number;
};

export type MonitorContractResponse = {
  message: string;
}
