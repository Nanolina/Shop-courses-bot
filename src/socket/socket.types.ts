import { DeployType, StatusType } from 'types';

export interface INotifyClientVideoUploadedParams {
  status: StatusType;
  userId: number;
  message: string;
}

export interface INotifyClientContractUpdatedParams {
  status: StatusType;
  userId: number;
  message: string;
  type?: DeployType;
  balance?: number;
  points?: number;
}
