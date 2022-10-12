import GetAllProductsRepository from '../../repositories/get-all-products-repository';
import DbGetAllProducts from './get-all-products';

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

const makeGetAllProductsRepository = () => {
  class GetAllProductsRepositoryStub implements GetAllProductsRepository {
    async getAllProducts(): Promise<any> {
      return Promise.resolve([makeFakeProduct()]);
    }
  }
  return new GetAllProductsRepositoryStub();
};

interface SutTypes {
  sut: DbGetAllProducts;
  getAllProductsRepositoryStub: GetAllProductsRepository;
}

const makeSut = (): SutTypes => {
  const getAllProductsRepositoryStub = makeGetAllProductsRepository();
  const sut = new DbGetAllProducts(getAllProductsRepositoryStub);
  return {
    sut,
    getAllProductsRepositoryStub,
  };
};

describe('DbGetAllProducts', () => {
  it('should call GetAllProductsRepository', async () => {
    const { sut, getAllProductsRepositoryStub } = makeSut();
    const getAllProductsSpy = jest.spyOn(
      getAllProductsRepositoryStub,
      'getAllProducts',
    );
    await sut.get();
    expect(getAllProductsSpy).toHaveBeenCalled();
  });

  it('should return an array of products on success', async () => {
    const { sut } = makeSut();
    const products = await sut.get();
    expect(products).toEqual([makeFakeProduct()]);
  });

  it('should return null if GetAllProductsRepository returns null', async () => {
    const { sut, getAllProductsRepositoryStub } = makeSut();
    jest
      .spyOn(getAllProductsRepositoryStub, 'getAllProducts')
      .mockReturnValueOnce(Promise.resolve(null));
    const products = await sut.get();
    expect(products).toBeNull();
  });
});
