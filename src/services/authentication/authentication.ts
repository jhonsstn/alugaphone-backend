import GetAccountByEmailRepository from '../../repositories/get-account-by-email-repository';
import { AuthenticationParams } from './authentication-interface';

export default class Authentication implements Authentication {
  constructor(
    private readonly getAccountByEmailRepository: GetAccountByEmailRepository,
  ) {}

  // TODO: change any return
  async auth(authenticationParams: AuthenticationParams): Promise<any> {
    await this.getAccountByEmailRepository.getAccountByEmail(
      authenticationParams.email,
    );

    return null;
  }
}
