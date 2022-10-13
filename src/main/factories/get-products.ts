import GetProductsController from '../../controllers/get-products/get-products';
import Controller from '../../controllers/interfaces/controller';
import ProductMongoRepository from '../../database/mongodb/product';
import DbGetProducts from '../../services/get-products/get-products';

export default function makeGetProductsController(): Controller {
  const productMongoRepository = new ProductMongoRepository();
  const getProducts = new DbGetProducts(productMongoRepository);
  return new GetProductsController(getProducts);
}
