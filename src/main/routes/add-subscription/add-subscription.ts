import { Router } from 'express';
import adaptRoute from '../../adapters/route-adapter';
import makeAddSubscriptionController from '../../factories/add-subscription';

export default (router: Router): void => {
  router.post('/subscriptions', adaptRoute(makeAddSubscriptionController()));
};
