export type SignupStep = 1 | 2 | 3;

export type SignupFormState = {
  name: string;
  password: string;
  confirmPassword: string;
  signupToken: string;
  otp: string;
  botUrl: string;
};