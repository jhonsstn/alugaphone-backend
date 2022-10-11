export interface AuthenticationParams {
  email: string;
  password: string;
}

export default interface Authentication {
  auth: (authenticationParams: AuthenticationParams) => Promise<string | null>;
}
