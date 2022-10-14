import SubscriptionModel from '../../models/subscription';
import GetSubscriptionsRepository from '../../repositories/get-subscriptions-repository';
import GetSubscriptions from './get-subscriptions-interface';

export default class DbGetSubscriptions implements GetSubscriptions {
  constructor(
    private readonly subscriptionRepository: GetSubscriptionsRepository,
  ) {}

  async get(): Promise<SubscriptionModel[] | null> {
    const subscriptions = await this.subscriptionRepository.getSubscriptions();
    return subscriptions;
  }
}
