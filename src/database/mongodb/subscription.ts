import AddSubscriptionRepository from '../../repositories/add-subscription-repository';
import {
  AddSubscriptionModel,
  AddSubscriptionResult,
} from '../../services/add-subscription/add-subscription-interface';

import MongoHelper from '../helpers/mongo-helper';

export default class SubscriptionMongoRepository
implements AddSubscriptionRepository {
  async add(
    subscription: AddSubscriptionModel,
  ): Promise<AddSubscriptionResult> {
    const subscriptionCollection = MongoHelper.getCollection('subscriptions');
    const { insertedId } = await subscriptionCollection.insertOne(subscription);
    return { id: insertedId };
  }
}
