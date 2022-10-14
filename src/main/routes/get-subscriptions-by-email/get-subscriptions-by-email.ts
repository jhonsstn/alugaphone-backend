import { Router } from 'express';
import adaptRoute from '../../adapters/route-adapter';
import makeGetSubscriptionsByEmailController from '../../factories/get-subscriptions-by-email';

export default (router: Router): void => {
  router.get(
    '/subscriptions/token',
    adaptRoute(makeGetSubscriptionsByEmailController()),
  );
};
