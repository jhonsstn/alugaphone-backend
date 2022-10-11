import { AccountModel } from '../models/account';
import { AddAccountModel } from '../services/add-account/add-account-interface';

export default interface AddAccountRepository {
  add(account: AddAccountModel): Promise<AccountModel>;
}
