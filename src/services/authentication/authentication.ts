import GetAccountByEmailRepository from '../../repositories/get-account-by-email-repository';
import HashComparer from '../bcrypt/hash-comparer-interface';
import { AuthenticationParams } from './authentication-interface';

export default class Authentication implements Authentication {
  constructor(
    private readonly getAccountByEmailRepository: GetAccountByEmailRepository,
    private readonly hashComparerStub: HashComparer,
  ) {}

  // TODO: change any return
  async auth(authenticationParams: AuthenticationParams): Promise<any> {
    const account = await this.getAccountByEmailRepository.getAccountByEmail(
      authenticationParams.email,
    );
    if (account) {
      await this.hashComparerStub.compare(
        authenticationParams.password,
        account.password,
      );
    }

    return null;
  }
}
