import { AccountModel } from '../../models/account';
import AddAccountRepository from '../../repositories/add-account-repository';
import Encrypter from '../encrypter/encrypter-interface';
import AddAccount, { AddAccountModel } from './add-account-interface';

export default class DbAddAccount implements AddAccount {
  constructor(
    private readonly encrypter: Encrypter,
    private readonly addAccountRepository: AddAccountRepository,
  ) {}

  async add(account: AddAccountModel): Promise<Omit<AccountModel, 'password'>> {
    const encryptedPassword = await this.encrypter.encrypt(account.password);
    const newAccount = await this.addAccountRepository.add({
      ...account,
      password: encryptedPassword,
    });
    return newAccount;
  }
}
