import express, { Router } from 'express';
import addSubscriptionRoute from '../routes/add-subscription/add-subscription';
import productByIdRoute from '../routes/get-product-by-id/get-product-by-id';
import productsRoute from '../routes/get-products/get-products';
import getSubscriptionsByEmail from '../routes/get-subscriptions-by-email/get-subscriptions-by-email';
import signInRoute from '../routes/signin/signin-route';
import signUpRoute from '../routes/signup/signup-route';

export default (app: express.Application): void => {
  const router = Router();
  app.use('/api', router);
  signUpRoute(router);
  signInRoute(router);
  productsRoute(router);
  productByIdRoute(router);
  addSubscriptionRoute(router);
  getSubscriptionsByEmail(router);
};
