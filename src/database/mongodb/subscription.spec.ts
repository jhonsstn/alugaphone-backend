import { Collection, ObjectId } from 'mongodb';
import { AddSubscriptionModel } from '../../services/add-subscription/add-subscription-interface';
import MongoHelper from '../helpers/mongo-helper';
import SubscriptionMongoRepository from './subscription';

let subscriptionCollection: Collection;

const makeFakeAddSubscription = (): AddSubscriptionModel => ({
  email: 'any_email@mail.com',
  document: 'any_document',
  productId: 'any_product_id',
  productCapacity: 1,
  createdAt: new Date(),
});

describe('Subscription Mongo Repository', () => {
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

  it('should return an id on add success', async () => {
    const sut = new SubscriptionMongoRepository();
    const products = await sut.add(makeFakeAddSubscription());
    expect(products).toStrictEqual({ id: expect.any(ObjectId) });
  });

  it('should return an array of subscriptions on getSubscriptions success', async () => {
    const sut = new SubscriptionMongoRepository();
    await subscriptionCollection.insertOne(makeFakeAddSubscription());
    const products = await sut.getSubscriptions('any_email@mail.com');
    expect(products).toEqual([
      {
        ...makeFakeAddSubscription(),
        id: expect.any(String),
        createdAt: expect.any(Date),
      },
    ]);
  });
});
