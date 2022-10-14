import { Router } from 'express';
import adaptRoute from '../../adapters/route-adapter';
import makeGetProductByIdController from '../../factories/get-product-by-id';

export default (router: Router): void => {
  router.get('/products/:id', adaptRoute(makeGetProductByIdController()));
};
