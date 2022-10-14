import SubscriptionModel from '../../models/subscription';

export default interface GetSubscriptions {
  get(): Promise<SubscriptionModel[]>;
}
