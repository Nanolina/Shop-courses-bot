import { DeployType, StatusType } from 'types';

export interface INotifyClientVideoUploadedParams {
  status: StatusType;
  userId: number;
  lessonId: string;
  message: string;
}

export interface INotifyClientContractUpdatedParams {
  status: StatusType;
  userId: number;
  message: string;
  courseId?: string;
  type?: DeployType;
  balance?: number;
  points?: number;
}
