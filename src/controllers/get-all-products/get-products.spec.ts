import ProductModel from '../../models/product';
import GetAllProducts from '../../services/get-all-products/get-all-products-interface';
import { noContent, serverError, success } from '../helpers/http';
import GetProductsController from './get-products';

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

const makeGetAllProducts = () => {
  class GetAllProductsStub implements GetAllProducts {
    async get(): Promise<ProductModel[]> {
      return Promise.resolve([makeFakeProduct()]);
    }
  }
  return new GetAllProductsStub();
};

const makeSut = () => {
  const getAllProductsStub = makeGetAllProducts();
  const sut = new GetProductsController(getAllProductsStub);
  return {
    sut,
    getAllProductsStub,
  };
};

describe('GetAllProducts Controller', () => {
  it('should return an array of products on success', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle();
    expect(httpResponse).toEqual(success([makeFakeProduct()]));
  });

  it('should return 500 if GetAllProducts throws', async () => {
    const { sut, getAllProductsStub } = makeSut();
    jest.spyOn(getAllProductsStub, 'get').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpResponse = await sut.handle();
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it('should return 204 if GetAllProducts returns an empty array', async () => {
    const { sut, getAllProductsStub } = makeSut();
    jest
      .spyOn(getAllProductsStub, 'get')
      .mockReturnValueOnce(Promise.resolve([]));
    const httpResponse = await sut.handle();
    expect(httpResponse).toEqual(noContent());
  });
});
