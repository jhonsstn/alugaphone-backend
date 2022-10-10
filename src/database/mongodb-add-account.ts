import { AccountModel } from '../models/account';
import AddAccountRepository from '../repositories/add-account-repository';
import { AddAccountModel } from '../services/add-account/add-account-interface';
import MongoHelper from './helpers/mongo-helper';

export default class AddAccountMongoRepository implements AddAccountRepository {
  async add(
    accountData: AddAccountModel,
  ): Promise<Omit<AccountModel, 'password'>> {
    const accountCollection = MongoHelper.getCollection('accounts');
    await accountCollection.insertOne(accountData);
    const { password, ...accountWithoutId } = accountData;
    return MongoHelper.mapId(accountWithoutId);
  }
}
