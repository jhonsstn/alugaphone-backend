import { Collection } from 'mongodb';
import request from 'supertest';
import MongoHelper from '../../../database/helpers/mongo-helper';
import app from '../../config/app';

let productsCollection: Collection;

const makeFakeProduct = () => ({
  id: 'any_id',
  name: 'any_name',
  prices: [
    {
      capacity: 1,
      price: 1,
    },
  ],
  imageUrl: 'any_image_url',
});

describe('GetProducts Route', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  beforeEach(async () => {
    productsCollection = MongoHelper.getCollection('products');
    await productsCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  it('should return an product array on success', async () => {
    await productsCollection.insertOne(makeFakeProduct());
    await request(app).get('/api/products').expect(200);
  });
});
