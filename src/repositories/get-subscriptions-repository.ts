import SubscriptionModel from '../models/subscription';

export default interface GetSubscriptionsRepository {
  getSubscriptions(email: string): Promise<SubscriptionModel[] | null>;
}
