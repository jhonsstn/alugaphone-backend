export interface EncrypterParams {
  id: string;
  email: string;
}

export interface Encrypter {
  encrypt(tokenData: EncrypterParams): Promise<string>;
}

export interface Decrypter {
  decrypt(token: string): Promise<EncrypterParams | null>;
}
