export type GetUserDataResponse = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  isVerifiedEmail: boolean;
};

export type GetEmailCodeResponse = {
  email: string;
  code: number;
};

export type UpdateResponse = {
  isVerifiedEmail: boolean;
};
