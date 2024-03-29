import {
  addSubscriptionPath,
  getProductByIdPath,
  getProductsPath,
  getSubscriptionByEmailPath,
  signInPath,
  signUpPath,
} from './paths/index';

export default {
  '/accounts/signup': signUpPath,
  '/accounts/signin': signInPath,
  '/products': getProductsPath,
  '/products/{productId}': getProductByIdPath,
  '/subscriptions': addSubscriptionPath,
  '/subscriptions/token': getSubscriptionByEmailPath,
};
