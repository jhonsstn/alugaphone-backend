import express, { Router } from 'express';
import signUpRoute from '../routes/signup-route';

export default (app: express.Application): void => {
  const router = Router();
  app.use('/api/accounts', router);
  signUpRoute(router);
};
