import { AccountModel } from '../../models/account';
import Encrypter from '../encrypter/encrypter-interface';
import AddAccount, { AddAccountModel } from './add-account-interface';

export default class DbAddAccount implements AddAccount {
  constructor(private readonly encrypter: Encrypter) {}

  // Omit<AccountModel, 'password'>
  async add(account: AddAccountModel): Promise<any> {
    await this.encrypter.encrypt(account.password);
  }
}
