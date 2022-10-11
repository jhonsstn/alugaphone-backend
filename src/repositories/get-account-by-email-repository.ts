import { AccountModel } from '../models/account';

export default interface GetAccountByEmailRepository {
  getAccountByEmail(email: string): Promise<AccountModel | null>;
}
