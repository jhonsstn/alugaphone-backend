import SubscriptionModel from '../../models/subscription';
import GetSubscriptions from '../../services/get-subscriptions/get-subscriptions-interface';
import {
  Decrypter,
  EncrypterParams,
} from '../../services/jwt/jwt-encrypt-interface';
import MissingParamError from '../errors/missing-param-error';
import { badRequest, success, unauthorized } from '../helpers/http';
import { HttpRequest } from '../interfaces/http';
import GetSubscriptionsController from './get-subscriptions';

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

const makeGetSubscriptions = (): GetSubscriptions => {
  class GetSubscriptionsStub implements GetSubscriptions {
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
  getSubscriptionsStub: GetSubscriptions;
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

describe('GetSubscriptions Controller', () => {
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

  it('should call GetSubscriptions', async () => {
    const { sut, getSubscriptionsStub } = makeSut();
    const getSpy = jest.spyOn(getSubscriptionsStub, 'get');
    await sut.handle(makeFakeRequest());
    expect(getSpy).toHaveBeenCalledTimes(1);
  });

  it('should return 200 if GetSubscriptions returns subscriptions', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(success([makeFakeSubscription()]));
  });
});
