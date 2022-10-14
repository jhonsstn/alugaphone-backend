import { cpf } from 'cpf-cnpj-validator';
import { Collection } from 'mongodb';
import request from 'supertest';
import MongoHelper from '../../../database/helpers/mongo-helper';
import SubscriptionModel from '../../../models/subscription';
import app from '../../config/app';

let subscriptionCollection: Collection;

let token: string;

describe('GetSubscriptionsByEmail Route', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  beforeEach(async () => {
    subscriptionCollection = MongoHelper.getCollection('subscriptions');
    await subscriptionCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  it('should return an array fo subscriptions on success', async () => {
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
      });

    await request(app)
      .get('/api/subscriptions/token')
      .set('authorization', token)
      .expect(200);
  });
});
