import {
  AddSubscriptionModel,
  AddSubscriptionResult,
} from '../services/add-subscription/add-subscription-interface';

export default interface AddSubscriptionRepository {
  add(subscription: AddSubscriptionModel): Promise<AddSubscriptionResult>;
}
