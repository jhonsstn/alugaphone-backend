import SubscriptionModel from '../../models/subscription';
import GetSubscriptionsRepository from '../../repositories/get-subscriptions-repository';
import GetSubscriptionsByEmail from './get-subscriptions-by-email-interface';

export default class DbGetSubscriptions implements GetSubscriptionsByEmail {
  constructor(
    private readonly subscriptionRepository: GetSubscriptionsRepository,
  ) {}

  async get(email: string): Promise<SubscriptionModel[] | null> {
    const subscriptions = await this.subscriptionRepository.getSubscriptions(
      email,
    );
    return subscriptions;
  }
}
