import SubscriptionModel from '../../models/subscription';
import AddSubscriptionRepository from '../../repositories/add-subscription-repository';
import GetSubscriptionsRepository from '../../repositories/get-subscriptions-repository';
import {
  AddSubscriptionModel,
  AddSubscriptionResult,
} from '../../services/add-subscription/add-subscription-interface';

import MongoHelper from '../helpers/mongo-helper';

export default class SubscriptionMongoRepository
implements AddSubscriptionRepository, GetSubscriptionsRepository {
  async add(
    subscription: AddSubscriptionModel,
  ): Promise<AddSubscriptionResult> {
    const subscriptionCollection = MongoHelper.getCollection('subscriptions');
    const { insertedId } = await subscriptionCollection.insertOne(subscription);
    return { id: insertedId };
  }

  async getSubscriptions(email: string): Promise<SubscriptionModel[] | null> {
    const subscriptionCollection = MongoHelper.getCollection('subscriptions');
    const subscriptions = await subscriptionCollection
      .find({ email })
      .toArray();
    return subscriptions && subscriptions.map(MongoHelper.mapId);
  }
}
