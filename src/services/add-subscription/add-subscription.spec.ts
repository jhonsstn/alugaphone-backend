import SubscriptionModel from '../../models/subscription';
import AddSubscriptionRepository from '../../repositories/add-subscription-repository';
import DbAddSubscription from './add-subscription';
import { AddSubscriptionModel } from './add-subscription-interface';

const makeFakeAddSubscription = (): AddSubscriptionModel => ({
  email: 'any_email@mail.com',
  document: 'any_document',
  productId: 'any_product_id',
  productCapacity: 1,
  createdAt: new Date(),
});

const makeFakeSubscription = (): SubscriptionModel => ({
  id: 'any_id',
  email: 'any_email@mail.com',
  document: 'any_document',
  productId: 'any_product_id',
  productCapacity: 1,
  createdAt: new Date(),
});

const makeAddSubscriptionRepository = (): AddSubscriptionRepository => {
  class AddSubscriptionRepositoryStub implements AddSubscriptionRepository {
    async add(_account: AddSubscriptionModel): Promise<SubscriptionModel> {
      return Promise.resolve(makeFakeSubscription());
    }
  }
  return new AddSubscriptionRepositoryStub();
};

interface SutTypes {
  sut: DbAddSubscription;
  addSubscriptionRepositoryStub: AddSubscriptionRepository;
}

const makeSut = (): SutTypes => {
  const addSubscriptionRepositoryStub = makeAddSubscriptionRepository();
  const sut = new DbAddSubscription(addSubscriptionRepositoryStub);
  return {
    sut,
    addSubscriptionRepositoryStub,
  };
};

describe('DbAddSubscription', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2022-10-13'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });
  it('should call AddSubscriptionRepository with correct values', async () => {
    const { sut, addSubscriptionRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addSubscriptionRepositoryStub, 'add');
    await sut.add(makeFakeAddSubscription());
    expect(addSpy).toHaveBeenCalledWith(makeFakeAddSubscription());
  });

  it('should throw if AddSubscriptionRepository throws', async () => {
    const { sut, addSubscriptionRepositoryStub } = makeSut();
    jest
      .spyOn(addSubscriptionRepositoryStub, 'add')
      .mockReturnValueOnce(Promise.reject(new Error()));
    const promise = sut.add(makeFakeAddSubscription());
    await expect(promise).rejects.toThrow();
  });

  it('should return an subscription on success', async () => {
    const { sut } = makeSut();
    const subscription = await sut.add(makeFakeAddSubscription());
    expect(subscription).toEqual(makeFakeSubscription());
  });
});
