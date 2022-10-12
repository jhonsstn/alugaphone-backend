import { Collection } from 'mongodb';
import { AccountModel } from '../../models/account';
import { AddAccountModel } from '../../services/add-account/add-account-interface';
import MongoHelper from '../helpers/mongo-helper';
import ProductMongoRepository from './product';

let accountCollection: Collection;

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

describe('Product Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  beforeEach(async () => {
    accountCollection = MongoHelper.getCollection('products');
    await accountCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  it('should return an product on getAllProducts success', async () => {
    const sut = new ProductMongoRepository();
    await accountCollection.insertOne(makeFakeProduct());
    const products = await sut.getAllProducts();
    expect(products).toEqual([makeFakeProduct()]);
  });
});
