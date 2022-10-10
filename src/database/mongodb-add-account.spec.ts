import MongoHelper from './helpers/mongo-helper';
import AddAccountMongoRepository from './mongodb-add-account';

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  it('should return an account on success', async () => {
    const sut = new AddAccountMongoRepository();
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
});
