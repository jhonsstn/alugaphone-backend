import SubscriptionModel from '../../models/subscription';
import GetSubscriptionsByEmailRepository from '../../repositories/get-subscriptions-by-email-repository';
import GetSubscriptionsByEmail from './get-subscriptions-by-email-interface';

export default class DbGetSubscriptionsByEmail
implements GetSubscriptionsByEmail {
  constructor(
    private readonly subscriptionRepository: GetSubscriptionsByEmailRepository,
  ) {}

  async get(email: string): Promise<SubscriptionModel[] | null> {
    const subscriptions = await this.subscriptionRepository.getSubscriptions(
      email,
    );
    return subscriptions;
  }
}
