import SubscriptionModel from '../../models/subscription';
import GetSubscriptionsByEmail from '../../services/get-subscriptions-by-email/get-subscriptions-by-email-interface';
import {
  Decrypter,
  EncrypterParams,
} from '../../services/jwt/jwt-encrypt-interface';
import MissingParamError from '../errors/missing-param-error';
import {
  badRequest,
  noContent,
  serverError,
  success,
  unauthorized,
} from '../helpers/http';
import { HttpRequest } from '../interfaces/http';
import GetSubscriptionsController from './get-subscriptions-by-email';

const makeFakeSubscription = (): SubscriptionModel => ({
  id: 'any_id',
  email: 'any_email@mail.com',
  document: 'any_document',
  productId: 'any_product_id',
  productCapacity: 1,
  createdAt: new Date(),
});

const makeFakeRequest = (): HttpRequest => ({
  body: {
    authorization: 'any_token',
  },
});

const makeGetSubscriptions = (): GetSubscriptionsByEmail => {
  class GetSubscriptionsStub implements GetSubscriptionsByEmail {
    async get(): Promise<SubscriptionModel[]> {
      return Promise.resolve([makeFakeSubscription()]);
    }
  }
  return new GetSubscriptionsStub();
};

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt(_token: string): Promise<EncrypterParams> {
      return {
        id: 'any_id',
        email: 'any_email@mail.com',
      };
    }
  }
  return new DecrypterStub();
};

interface SutTypes {
  sut: GetSubscriptionsController;
  getSubscriptionsStub: GetSubscriptionsByEmail;
  decrypterStub: Decrypter;
}

const makeSut = (): SutTypes => {
  const getSubscriptionsStub = makeGetSubscriptions();
  const decrypterStub = makeDecrypter();
  const sut = new GetSubscriptionsController(
    getSubscriptionsStub,
    decrypterStub,
  );
  return {
    sut,
    getSubscriptionsStub,
    decrypterStub,
  };
};

describe('GetSubscriptionsByEmail Controller', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2022-10-13'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });
  it('should return 400 if no authorization is provided', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(
      badRequest(new MissingParamError('authorization')),
    );
  });

  it('should call Decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut();
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt');
    await sut.handle(makeFakeRequest());
    expect(decryptSpy).toHaveBeenCalledWith('any_token');
  });

  it('should return 401 if Decrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut();
    jest.spyOn(decrypterStub, 'decrypt').mockResolvedValueOnce(null);
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(unauthorized());
  });

  it('should call GetSubscriptionsByEmail with correct value', async () => {
    const { sut, getSubscriptionsStub } = makeSut();
    const getSpy = jest.spyOn(getSubscriptionsStub, 'get');
    await sut.handle(makeFakeRequest());
    expect(getSpy).toHaveBeenCalledWith('any_email@mail.com');
  });

  it('should return 200 if GetSubscriptionsByEmail returns subscriptions', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(success([makeFakeSubscription()]));
  });

  it('should return 500 if GetSubscriptionsByEmail throws', async () => {
    const { sut, getSubscriptionsStub } = makeSut();
    jest.spyOn(getSubscriptionsStub, 'get').mockRejectedValueOnce(new Error());
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it('should return 500 if Decrypter throws', async () => {
    const { sut, decrypterStub } = makeSut();
    jest.spyOn(decrypterStub, 'decrypt').mockRejectedValueOnce(new Error());
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it('should return 204 if GetSubscriptionsByEmail returns null', async () => {
    const { sut, getSubscriptionsStub } = makeSut();
    jest.spyOn(getSubscriptionsStub, 'get').mockResolvedValueOnce(null);
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(noContent());
  });
});
