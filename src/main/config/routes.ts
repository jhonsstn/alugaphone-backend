import express, { Router } from 'express';
import signInRoute from '../routes/signin/signin-route';
import signUpRoute from '../routes/signup/signup-route';

export default (app: express.Application): void => {
  const router = Router();
  app.use('/api/accounts', router);
  signUpRoute(router);
  signInRoute(router);
};
