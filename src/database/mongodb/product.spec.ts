import { Collection, ObjectId } from 'mongodb';
import MongoHelper from '../helpers/mongo-helper';
import ProductMongoRepository from './product';

let productsCollection: Collection;

const makeFakeProduct = () => ({
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
    productsCollection = MongoHelper.getCollection('products');
    await productsCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  it('should return an array of products on getProducts success', async () => {
    const sut = new ProductMongoRepository();
    await productsCollection.insertOne(makeFakeProduct());
    const products = await sut.getProducts();
    expect(products).toEqual([
      { ...makeFakeProduct(), id: expect.any(String) },
    ]);
  });

  it('should return a product on getById success', async () => {
    const sut = new ProductMongoRepository();
    const { insertedId } = await productsCollection.insertOne(
      makeFakeProduct(),
    );
    const products = await sut.getById(new ObjectId(insertedId));
    expect(products).toEqual({ ...makeFakeProduct(), id: expect.any(String) });
  });
});
