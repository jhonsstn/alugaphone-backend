import ProductModel from '../../models/product';
import GetProductById from '../../services/get-product-by-id/get-product-by-id-interface';
import { noContent, serverError, success } from '../helpers/http';
import GetProductByIdController from './get-product-by-id';

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

const makeDbGetProductById = () => {
  class DbGetProductById implements GetProductById {
    async getById(_id: string): Promise<ProductModel | null> {
      return Promise.resolve(makeFakeProduct());
    }
  }
  return new DbGetProductById();
};

interface SutTypes {
  sut: GetProductByIdController;
  dbGetProductByIdStub: GetProductById;
}

const makeSut = (): SutTypes => {
  const dbGetProductByIdStub = makeDbGetProductById();
  const sut = new GetProductByIdController(dbGetProductByIdStub);
  return {
    sut,
    dbGetProductByIdStub,
  };
};

describe('GetProductByIdController', () => {
  it('should call DbGetProductById with correct values', async () => {
    const { sut, dbGetProductByIdStub } = makeSut();
    const getByIdSpy = jest.spyOn(dbGetProductByIdStub, 'getById');
    await sut.handle({
      body: {
        id: 'any_id',
      },
    });
    expect(getByIdSpy).toHaveBeenCalledWith('any_id');
  });

  it('should return 500 if DbGetProductById throws', async () => {
    const { sut, dbGetProductByIdStub } = makeSut();
    jest.spyOn(dbGetProductByIdStub, 'getById').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpResponse = await sut.handle({
      body: {
        id: 'any_id',
      },
    });
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it('should return 204 if DbGetProductById returns null', async () => {
    const { sut, dbGetProductByIdStub } = makeSut();
    jest.spyOn(dbGetProductByIdStub, 'getById').mockResolvedValueOnce(null);
    const httpResponse = await sut.handle({
      body: {
        id: 'any_id',
      },
    });
    expect(httpResponse).toEqual(noContent());
  });

  it('should return 200 if DbGetProductById returns a product', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({
      body: {
        id: 'any_id',
      },
    });
    expect(httpResponse).toEqual(success(makeFakeProduct()));
  });
});
