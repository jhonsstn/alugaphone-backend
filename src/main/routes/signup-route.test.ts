import { cpf } from 'cpf-cnpj-validator';
import request from 'supertest';
import MongoHelper from '../../database/helpers/mongo-helper';
import app from '../config/app';

describe('SignUp Routes', () => {
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

  test('should return an account on success', async () => {
    await request(app)
      .post('/api/accounts/signup')
      .send({
        name: 'any_name',
        email: 'any_email@mail.com',
        document: cpf.generate(),
        password: 'any_password',
      })
      .expect(200);
  });
});
