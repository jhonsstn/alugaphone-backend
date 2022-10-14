import { cpf } from 'cpf-cnpj-validator';
import { Collection } from 'mongodb';
import request from 'supertest';
import MongoHelper from '../../../database/helpers/mongo-helper';
import app from '../../config/app';

let accountCollection: Collection;

let token: string;

describe('AddSubscription Route', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  beforeEach(async () => {
    accountCollection = MongoHelper.getCollection('subscriptions');
    await accountCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  it('should return a subscription id on success', async () => {
    await request(app).post('/api/accounts/signup').send({
      name: 'any_name',
      email: 'any_email@mail.com',
      document: cpf.generate(),
      password: 'any_password',
    });

    await request(app)
      .post('/api/accounts/signin')
      .send({
        email: 'any_email@mail.com',
        password: 'any_password',
      })
      .then((res) => {
        token = res.body.token;
      });

    await request(app)
      .post('/api/subscriptions')
      .set('authorization', token)
      .send({
        email: 'any_email@mail.com',
        document: cpf.generate(),
        productId: 'any_product_id',
        productCapacity: 1,
      })
      .expect(200);
  });
});
