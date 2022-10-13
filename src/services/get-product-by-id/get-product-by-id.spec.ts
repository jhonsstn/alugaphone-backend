import GetProductByIdRepository from '../../repositories/get-product-by-id-repository';
import DbGetProductById from './get-product-by-id';

const makeFakeProduct = () => ({
  id: 'any_id',
  name: 'any_name',
  prices: [
    {
      capacity: 1,
      price: 1,
    },
  ],
  imageUrl: 'any_image_url',
});

const makeGetProductByIdRepository = () => {
  class GetProductByIdRepositoryStub implements GetProductByIdRepository {
    async getById(id: string): Promise<any> {
      return Promise.resolve(makeFakeProduct());
    }
  }
  return new GetProductByIdRepositoryStub();
};

interface SutTypes {
  sut: DbGetProductById;
  getProductByIdRepositoryStub: GetProductByIdRepository;
}

const makeSut = (): SutTypes => {
  const getProductByIdRepositoryStub = makeGetProductByIdRepository();
  const sut = new DbGetProductById(getProductByIdRepositoryStub);
  return {
    sut,
    getProductByIdRepositoryStub,
  };
};

describe('DbGetProductById', () => {
  it('should call GetProductByIdRepository', async () => {
    const { sut, getProductByIdRepositoryStub } = makeSut();
    const getByIdSpy = jest.spyOn(getProductByIdRepositoryStub, 'getById');
    await sut.getById('any_id');
    expect(getByIdSpy).toHaveBeenCalledWith('any_id');
  });

  it('should return a product on success', async () => {
    const { sut } = makeSut();
    const product = await sut.getById('any_id');
    expect(product).toEqual(makeFakeProduct());
  });

  it('should return null if GetProductByIdRepository returns null', async () => {
    const { sut, getProductByIdRepositoryStub } = makeSut();
    jest
      .spyOn(getProductByIdRepositoryStub, 'getById')
      .mockReturnValueOnce(Promise.resolve(null));
    const product = await sut.getById('any_id');
    expect(product).toBeNull();
  });

  it('should throw if GetProductByIdRepository throws', async () => {
    const { sut, getProductByIdRepositoryStub } = makeSut();
    jest
      .spyOn(getProductByIdRepositoryStub, 'getById')
      .mockReturnValueOnce(Promise.reject(new Error()));
    const promise = sut.getById('any_id');
    await expect(promise).rejects.toThrow();
  });
});
