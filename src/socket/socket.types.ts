import { DeployType, StatusType } from 'types';

export interface INotifyClientContractUpdatedParams {
  status: StatusType;
  userId: number;
  message: string;
  courseId?: string;
  type?: DeployType;
  balance?: number;
  points?: number;
}
