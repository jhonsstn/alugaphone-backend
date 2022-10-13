import GetProductByIdController from '../../controllers/get-product-by-id/get-product-by-id';
import GetProductsController from '../../controllers/get-products/get-products';
import Controller from '../../controllers/interfaces/controller';
import ProductMongoRepository from '../../database/mongodb/product';
import DbGetProductById from '../../services/get-product-by-id/get-product-by-id';

export default function makeGetProductByIdController(): Controller {
  const productMongoRepository = new ProductMongoRepository();
  const getProductById = new DbGetProductById(productMongoRepository);
  return new GetProductByIdController(getProductById);
}
