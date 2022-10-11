import { AccountModel } from '../../models/account';
import AddAccountRepository from '../../repositories/add-account-repository';
import GetAccountByEmailRepository from '../../repositories/get-account-by-email-repository';
import { AddAccountModel } from '../../services/add-account/add-account-interface';
import MongoHelper from '../helpers/mongo-helper';

export default class AccountMongoRepository
implements AddAccountRepository, GetAccountByEmailRepository {
  async add(
    accountData: AddAccountModel,
  ): Promise<Omit<AccountModel, 'password'>> {
    const accountCollection = MongoHelper.getCollection('accounts');
    await accountCollection.insertOne(accountData);
    const { password, ...accountWithoutId } = accountData;
    return MongoHelper.mapId(accountWithoutId);
  }

  async getAccountByEmail(email: string): Promise<AccountModel | null> {
    const accountCollection = MongoHelper.getCollection('accounts');
    const account = await accountCollection.findOne({ email });
    return account && MongoHelper.mapId(account);
  }
}
