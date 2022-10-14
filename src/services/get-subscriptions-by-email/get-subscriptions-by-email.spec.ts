import SubscriptionModel from '../../models/subscription';
import GetSubscriptionsByEmailRepository from '../../repositories/get-subscriptions-by-email-repository';
import DbGetSubscriptionsByEmail from './get-subscriptions-by-email';
import GetSubscriptionsByEmail from './get-subscriptions-by-email-interface';

const makeFakeSubscription: () => SubscriptionModel = () => ({
  id: '63498946c68d445ad2ad12a6',
  email: 'any_email@mail.com',
  document: '38869781844',
  productId: 'any_product_id',
  productCapacity: 1,
  createdAt: new Date(),
});

const makeGetSubscriptionsByEmail = (): GetSubscriptionsByEmailRepository => {
  class GetSubscriptionsByEmailRepositoryStub
  implements GetSubscriptionsByEmailRepository {
    async getSubscriptions(
      _email: string,
    ): Promise<SubscriptionModel[] | null> {
      return [makeFakeSubscription()];
    }
  }
  return new GetSubscriptionsByEmailRepositoryStub();
};

interface SutTypes {
  sut: GetSubscriptionsByEmail;
  getSubscriptionsByEmailRepositoryStub: GetSubscriptionsByEmailRepository;
}

const makeSut = (): SutTypes => {
  const getSubscriptionsByEmailRepositoryStub = makeGetSubscriptionsByEmail();
  const sut = new DbGetSubscriptionsByEmail(
    getSubscriptionsByEmailRepositoryStub,
  );
  return {
    sut,
    getSubscriptionsByEmailRepositoryStub,
  };
};

describe('DbGetSubscriptionsByEmail', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2022-10-13'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });
  it('should call GetSubscriptionsByEmailRepository with correct email', async () => {
    const { sut, getSubscriptionsByEmailRepositoryStub } = makeSut();
    const getSubscriptionsByEmailSpy = jest.spyOn(
      getSubscriptionsByEmailRepositoryStub,
      'getSubscriptions',
    );
    await sut.get('any_email@mail.com');
    expect(getSubscriptionsByEmailSpy).toHaveBeenCalledWith(
      'any_email@mail.com',
    );
  });

  it('should return null if GetSubscriptionsByEmailRepository returns null', async () => {
    const { sut, getSubscriptionsByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(getSubscriptionsByEmailRepositoryStub, 'getSubscriptions')
      .mockResolvedValueOnce(null);
    const subscriptions = await sut.get('any_email@mail.com');
    expect(subscriptions).toBeNull();
  });

  it('should return subscriptions if GetSubscriptionsByEmailRepository returns subscriptions', async () => {
    const { sut } = makeSut();
    const subscriptions = await sut.get('any_email@mail.com');
    expect(subscriptions).toEqual([makeFakeSubscription()]);
  });
});
