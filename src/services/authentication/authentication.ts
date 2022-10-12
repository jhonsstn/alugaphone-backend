import GetAccountByEmailRepository from '../../repositories/get-account-by-email-repository';
import HashComparer from '../bcrypt/hash-comparer-interface';
import { Encrypter } from '../jwt/jwt-encrypt-interface';
import {
  Authentication,
  AuthenticationParams,
} from './authentication-interface';

export default class Authenticator implements Authentication {
  constructor(
    private readonly getAccountByEmailRepository: GetAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
  ) {}

  async auth(
    authenticationParams: AuthenticationParams,
  ): Promise<string | null> {
    const account = await this.getAccountByEmailRepository.getAccountByEmail(
      authenticationParams.email,
    );
    if (account) {
      const isValid = await this.hashComparer.compare(
        authenticationParams.password,
        account.password,
      );
      if (isValid) {
        const token = await this.encrypter.encrypt({
          id: account.id,
          email: account.email,
        });
        return token;
      }
    }

    return null;
  }
}
