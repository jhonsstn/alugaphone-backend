import { ObjectId } from 'mongodb';

export interface AddSubscriptionResult {
  id: ObjectId;
}

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
  ): Promise<AddSubscriptionResult>;
}
