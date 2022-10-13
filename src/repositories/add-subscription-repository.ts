import SubscriptionModel from '../models/subscription';
import { AddSubscriptionModel } from '../services/add-subscription/add-subscription-interface';

export default interface AddSubscriptionRepository {
  add(account: AddSubscriptionModel): Promise<SubscriptionModel>;
}
