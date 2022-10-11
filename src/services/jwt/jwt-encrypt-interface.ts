export interface EncrypterParams {
  id: string;
  email: string;
}

export interface Encrypter {
  encrypt(tokenData: EncrypterParams): Promise<string>;
}
