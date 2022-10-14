import { Router } from 'express';
import adaptRoute from '../../adapters/route-adapter';
import makeGetSubscriptionsController from '../../factories/get-subscriptions';

export default (router: Router): void => {
  router.get('/subscriptions', adaptRoute(makeGetSubscriptionsController()));
};
