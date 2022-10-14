import { Collection } from 'mongodb';
import request from 'supertest';
import MongoHelper from '../../../database/helpers/mongo-helper';
import ProductModel from '../../../models/product';

import app from '../../config/app';

let productCollection: Collection;

let product: string;

const makeFakeProduct = (): Omit<ProductModel, 'id'> => ({
  name: 'iPhone 12',
  prices: [
    {
      capacity: 64,
      price: 2.445,
    },
    {
      capacity: 128,
      price: 2.711,
    },
    {
      capacity: 256,
      price: 3.093,
    },
  ],
  imageUrl:
    'https://yacare-products-image.s3.sa-east-1.amazonaws.com/iphone/4x/iPhone+12.png',
});

describe('GetProductById Route', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  beforeEach(async () => {
    productCollection = MongoHelper.getCollection('products');
    await productCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  it('should return a product on success', async () => {
    await productCollection.insertOne(makeFakeProduct());
    await request(app)
      .get('/api/products')
      .then((res) => {
        product = res.body[0].id;
      });

    await request(app).get(`/api/products/${product}`).expect(200);
  });
});
