import SubscriptionModel from '../models/subscription';

export default interface GetSubscriptionsRepository {
  getSubscriptions(): Promise<SubscriptionModel[] | null>;
}
