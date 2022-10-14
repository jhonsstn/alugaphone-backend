import SubscriptionModel from '../../models/subscription';

export default interface GetSubscriptionsByEmail {
  get(email: string): Promise<SubscriptionModel[] | null>;
}
