import bcrypt from 'bcrypt';
import HashComparer from './hash-comparer-interface';
import Hasher from './hasher-interface';

export default class BcryptAdapter implements Hasher, HashComparer {
  constructor(private readonly salt: number) {}

  async encrypt(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, this.salt);
    return hashedPassword;
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    const isValid = await bcrypt.compare(password, hashedPassword);
    return isValid;
  }
}
