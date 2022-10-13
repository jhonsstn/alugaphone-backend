import GetProductsRepository from '../../repositories/get-products-repository';
import DbGetProducts from './get-products';

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

const makeGetProductsRepository = () => {
  class GetProductsRepositoryStub implements GetProductsRepository {
    async getProducts(): Promise<any> {
      return Promise.resolve([makeFakeProduct()]);
    }
  }
  return new GetProductsRepositoryStub();
};

interface SutTypes {
  sut: DbGetProducts;
  GetProductsRepositoryStub: GetProductsRepository;
}

const makeSut = (): SutTypes => {
  const GetProductsRepositoryStub = makeGetProductsRepository();
  const sut = new DbGetProducts(GetProductsRepositoryStub);
  return {
    sut,
    GetProductsRepositoryStub,
  };
};

describe('DbGetProducts', () => {
  it('should call GetProductsRepository', async () => {
    const { sut, GetProductsRepositoryStub } = makeSut();
    const getProductsSpy = jest.spyOn(GetProductsRepositoryStub, 'getProducts');
    await sut.get();
    expect(getProductsSpy).toHaveBeenCalled();
  });

  it('should return an array of products on success', async () => {
    const { sut } = makeSut();
    const products = await sut.get();
    expect(products).toEqual([makeFakeProduct()]);
  });

  it('should return null if GetProductsRepository returns null', async () => {
    const { sut, GetProductsRepositoryStub } = makeSut();
    jest
      .spyOn(GetProductsRepositoryStub, 'getProducts')
      .mockReturnValueOnce(Promise.resolve(null));
    const products = await sut.get();
    expect(products).toBeNull();
  });
});
