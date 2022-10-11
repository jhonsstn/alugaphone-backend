import bcrypt from 'bcrypt';
import Hasher from './hasher-interface';

export default class BcryptAdapter implements Hasher {
  constructor(private readonly salt: number) {}

  async encrypt(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, this.salt);
    return hashedPassword;
  }
}
