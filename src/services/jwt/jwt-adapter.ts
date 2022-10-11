import jwt from 'jsonwebtoken';
import { Encrypter, EncrypterParams } from './jwt-encrypt-interface';

export default class JwtAdapter implements Encrypter {
  constructor(private readonly secret: string) {}

  async encrypt(tokenData: EncrypterParams): Promise<string> {
    const token = jwt.sign(tokenData, this.secret);
    return token;
  }
}
