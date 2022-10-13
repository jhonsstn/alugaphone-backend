export default interface SubscriptionModel {
  id: string;
  email: string;
  document: string;
  productId: string;
  productCapacity: number;
  createdAt: Date;
}
