import { Router } from 'express';
import adaptSignUp from '../adapters/signup';
import makeSignUpController from '../factories/signup';

export default (router: Router): void => {
  router.post('/signup', adaptSignUp(makeSignUpController()));
};
