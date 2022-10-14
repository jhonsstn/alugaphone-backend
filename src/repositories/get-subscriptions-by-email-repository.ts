import SubscriptionModel from '../models/subscription';

export default interface GetSubscriptionsByEmailRepository {
  getSubscriptions(email: string): Promise<SubscriptionModel[] | null>;
}
