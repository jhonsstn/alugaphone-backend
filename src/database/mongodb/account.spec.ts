import { Collection } from 'mongodb';
import { AccountModel } from '../../models/account';
import { AddAccountModel } from '../../services/add-account/add-account-interface';
import MongoHelper from '../helpers/mongo-helper';
import AccountMongoRepository from './account';

let accountCollection: Collection;

const makeFakeUserData = (): AddAccountModel => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  document: 'any_document',
  password: 'any_password',
});

const makeFakeAccountData = (): AccountModel => ({
  id: expect.any(String),
  name: 'any_name',
  email: 'any_email@mail.com',
  document: 'any_document',
  password: 'any_password',
});

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  beforeEach(async () => {
    accountCollection = MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  it('should return an account on account creation success', async () => {
    const sut = new AccountMongoRepository();
    const account = await sut.add({
      name: 'any_name',
      email: 'any_email@mail.com',
      document: 'any_document',
      password: 'any_password',
    });
    expect(account).toEqual({
      id: expect.any(String),
      name: 'any_name',
      email: 'any_email@mail.com',
      document: 'any_document',
    });
  });

  it('should return an account on getting an account by email success', async () => {
    const sut = new AccountMongoRepository();
    await accountCollection.insertOne(makeFakeUserData());
    const account = await sut.getAccountByEmail('any_email@mail.com');
    expect(account).toEqual(makeFakeAccountData());
  });
});
