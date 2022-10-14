import ProductModel from '../../models/product';
import GetProducts from '../../services/get-products/get-products-interface';
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

const makeGetProducts = () => {
  class GetProductsStub implements GetProducts {
    async get(): Promise<ProductModel[]> {
      return Promise.resolve([makeFakeProduct()]);
    }
  }
  return new GetProductsStub();
};

interface SutTypes {
  sut: GetProductsController;
  getProductsStub: GetProducts;
}

const makeSut = (): SutTypes => {
  const getProductsStub = makeGetProducts();
  const sut = new GetProductsController(getProductsStub);
  return {
    sut,
    getProductsStub,
  };
};

describe('GetProducts Controller', () => {
  it('should call GetProducts', async () => {
    const { sut, getProductsStub } = makeSut();
    const getProductsSpy = jest.spyOn(getProductsStub, 'get');
    await sut.handle();
    expect(getProductsSpy).toHaveBeenCalled();
  });

  it('should return an array of products on success', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle();
    expect(httpResponse).toEqual(success([makeFakeProduct()]));
  });

  it('should return 500 if GetProducts throws', async () => {
    const { sut, getProductsStub } = makeSut();
    jest.spyOn(getProductsStub, 'get').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpResponse = await sut.handle();
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it('should return 204 if GetProducts returns null', async () => {
    const { sut, getProductsStub } = makeSut();
    jest.spyOn(getProductsStub, 'get').mockResolvedValueOnce(null);
    const httpResponse = await sut.handle();
    expect(httpResponse).toEqual(noContent());
  });
});
