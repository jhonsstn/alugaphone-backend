import validator from 'validator';
import GetAccountByEmailRepository from '../../repositories/get-account-by-email-repository';
import EmailValidator from './email-validator-interface';

export default class EmailValidatorAdapter implements EmailValidator {
  constructor(
    private readonly getAccountByEmailRepository: GetAccountByEmailRepository,
  ) {}

  isValid(email: string): boolean {
    return validator.isEmail(email);
  }

  async checkIfAccountExists(email: string): Promise<boolean> {
    const account = await this.getAccountByEmailRepository.getAccountByEmail(
      email,
    );
    return !!account;
  }
}
