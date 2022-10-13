import { Router } from 'express';
import adaptSignIn from '../../adapters/route-adapter';
import makeSignInController from '../../factories/signin';

export default (router: Router): void => {
  router.post('/accounts/signin', adaptSignIn(makeSignInController()));
};
