export interface AuthenticationParams {
  email: string;
  password: string;
}

export interface AuthenticationResult {
  accessToken: string;
}

export interface Authentication {
  auth: (
    authenticationParams: AuthenticationParams
  ) => Promise<AuthenticationResult | null>;
}
