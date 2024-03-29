import { cpf } from 'cpf-cnpj-validator';
import { Collection } from 'mongodb';
import request from 'supertest';
import MongoHelper from '../../../database/helpers/mongo-helper';
import app from '../../config/app';

let accountCollection: Collection;

describe('SignIp Route', () => {
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

  it('should return a token on success', async () => {
    await request(app)
      .post('/api/accounts/signup')
      .send({
        name: 'any_name',
        email: 'any_email@mail.com',
        document: cpf.generate(),
        password: 'any_password',
      })
      .expect(200);

    await request(app)
      .post('/api/accounts/signin')
      .send({
        email: 'any_email@mail.com',
        password: 'any_password',
      })
      .expect(200);
  });
});
