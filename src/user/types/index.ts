export type GetUserDataResponse = {
  phone: string;
  email: string;
  isVerifiedEmail: boolean;
};

export type GetEmailCodeResponse = {
  email: string;
  code: number;
};
