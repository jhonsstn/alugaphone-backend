import AddSubscriptionRepository from '../../repositories/add-subscription-repository';
import AddSubscription, {
  AddSubscriptionModel,
  AddSubscriptionResult,
} from './add-subscription-interface';

export default class DbAddSubscription implements AddSubscription {
  constructor(
    private readonly subscriptionRepository: AddSubscriptionRepository,
  ) {}

  async add(
    subscription: Omit<AddSubscriptionModel, 'createdAt'>,
  ): Promise<AddSubscriptionResult> {
    const newSubscription = await this.subscriptionRepository.add({
      ...subscription,
      createdAt: new Date(),
    });
    return newSubscription;
  }
}
