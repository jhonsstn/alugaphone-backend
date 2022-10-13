import SubscriptionModel from '../../models/subscription';

export interface AddSubscriptionModel {
  email: string;
  document: string;
  productId: string;
  productCapacity: number;
  createdAt: Date;
}

export default interface AddSubscription {
  add(
    subscription: Omit<AddSubscriptionModel, 'createdAt'>
  ): Promise<SubscriptionModel>;
}
