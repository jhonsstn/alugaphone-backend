import { AccountModel } from '../../models/account';

export interface AddAccountModel {
  name: string;
  email: string;
  document: string;
  password: string;
}

export default interface AddAccount {
  add(account: AddAccountModel): Promise<Omit<AccountModel, 'password'>>;
}
