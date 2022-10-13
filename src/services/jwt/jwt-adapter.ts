import jwt from 'jsonwebtoken';
import { Decrypter, Encrypter, EncrypterParams } from './jwt-encrypt-interface';

export default class JwtAdapter implements Encrypter, Decrypter {
  constructor(private readonly secret: string) {}

  async encrypt(tokenData: EncrypterParams): Promise<string> {
    const token = jwt.sign(tokenData, this.secret);
    return token;
  }

  async decrypt(token: string): Promise<EncrypterParams | null> {
    try {
      const tokenData = jwt.verify(token, this.secret) as EncrypterParams;
      return tokenData;
    } catch (error) {
      return null;
    }
  }
}
