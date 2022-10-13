export interface AuthenticationParams {
  email: string;
  password: string;
}

export interface AuthenticationResult {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Authentication {
  auth: (
    authenticationParams: AuthenticationParams
  ) => Promise<AuthenticationResult | null>;
}
