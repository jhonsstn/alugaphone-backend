import { Router } from 'express';
import adaptRoute from '../../adapters/route-adapter';
import makeGetProductsController from '../../factories/get-products';

export default (router: Router): void => {
  router.get('/products', adaptRoute(makeGetProductsController()));
};
