import express, { Router } from 'express';
import productsRoute from '../routes/get-products/get-products';
import signInRoute from '../routes/signin/signin-route';
import signUpRoute from '../routes/signup/signup-route';

export default (app: express.Application): void => {
  const router = Router();
  app.use('/api', router);
  signUpRoute(router);
  signInRoute(router);
  productsRoute(router);
};
