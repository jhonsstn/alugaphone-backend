import SubscriptionModel from '../../models/subscription';
import AddSubscription, {
  AddSubscriptionModel,
} from '../../services/add-subscription/add-subscription-interface';
import CPFValidator from '../../services/cpf-validator/cpf-validator-interface';
import EmailValidator from '../../services/email-validator/email-validator-interface';
import {
  Decrypter,
  EncrypterParams,
} from '../../services/jwt/jwt-encrypt-interface';
import InvalidParamError from '../errors/invalid-param-error';
import MissingParamError from '../errors/missing-param-error';
import {
  badRequest,
  serverError,
  success,
  unauthorized,
} from '../helpers/http';
import { HttpRequest } from '../interfaces/http';
import AddSubscriptionController from './add-subscription';

jest.useFakeTimers();
jest.setSystemTime(new Date('2022-10-13'));

const makeFakeSubscription = (): SubscriptionModel => ({
  id: 'valid_id',
  email: 'any_email@mail.com',
  document: 'any_document',
  productId: 'any_product_id',
  productCapacity: 1,
  createdAt: new Date(),
});

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    document: 'any_document',
    productId: 'any_product_id',
    productCapacity: 1,
    authorization: 'any_token',
  },
});

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt(_token: string): Promise<EncrypterParams> {
      return {
        id: 'any_id',
        email: 'any_email@mail.com',
      };
    }
  }
  return new DecrypterStub();
};

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(_email: string): boolean {
      return true;
    }

    async checkIfAccountExists(_email: string): Promise<boolean> {
      return Promise.resolve(false);
    }
  }
  return new EmailValidatorStub();
};

const makeCPFValidator = (): CPFValidator => {
  class CPFValidatorStub implements CPFValidator {
    isValid(_cpf: string): boolean {
      return true;
    }
  }
  return new CPFValidatorStub();
};

const makeAddSubscription = (): AddSubscription => {
  class AddSubscriptionStub implements AddSubscription {
    async add(_subscription: AddSubscriptionModel): Promise<SubscriptionModel> {
      return Promise.resolve(makeFakeSubscription());
    }
  }
  return new AddSubscriptionStub();
};

interface SutTypes {
  sut: AddSubscriptionController;
  decrypterStub: Decrypter;
  emailValidatorStub: EmailValidator;
  cpfValidatorStub: CPFValidator;
  addSubscriptionStub: AddSubscription;
}

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypter();
  const emailValidatorStub = makeEmailValidator();
  const cpfValidatorStub = makeCPFValidator();
  const addSubscriptionStub = makeAddSubscription();
  const sut = new AddSubscriptionController(
    decrypterStub,
    emailValidatorStub,
    cpfValidatorStub,
    addSubscriptionStub,
  );
  return {
    sut,
    decrypterStub,
    emailValidatorStub,
    cpfValidatorStub,
    addSubscriptionStub,
  };
};

describe('AddSubscription Controller', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2022-10-13'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should return 400 if no token is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = makeFakeRequest();
    delete httpRequest.body.authorization;
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(
      badRequest(new MissingParamError('authorization')),
    );
  });

  it('should return 400 if no email is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = makeFakeRequest();
    delete httpRequest.body.email;
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  });

  it('should return 400 if no document is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = makeFakeRequest();
    delete httpRequest.body.document;
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('document')));
  });

  it('should return 400 if no productId is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = makeFakeRequest();
    delete httpRequest.body.productId;
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(
      badRequest(new MissingParamError('productId')),
    );
  });

  it('should return 400 if no productCapacity is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = makeFakeRequest();
    delete httpRequest.body.productCapacity;
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(
      badRequest(new MissingParamError('productCapacity')),
    );
  });

  it('should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')));
  });

  it('should return 400 if an invalid document is provided', async () => {
    const { sut, cpfValidatorStub } = makeSut();
    jest.spyOn(cpfValidatorStub, 'isValid').mockReturnValueOnce(false);
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('document')));
  });

  it('should return 401 if an invalid token is provided', async () => {
    const { sut, decrypterStub } = makeSut();
    jest.spyOn(decrypterStub, 'decrypt').mockResolvedValueOnce(null);
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(unauthorized());
  });

  it('should call Decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut();
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt');
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(decryptSpy).toHaveBeenCalledWith(httpRequest.body.authorization);
  });

  it('should call EmailValidator with correct values', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email);
  });

  it('should call CPFValidator with correct values', async () => {
    const { sut, cpfValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(cpfValidatorStub, 'isValid');
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.document);
  });

  it('should call AddSubscription with correct values', async () => {
    const { sut, addSubscriptionStub } = makeSut();
    const addSpy = jest.spyOn(addSubscriptionStub, 'add');
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(addSpy).toHaveBeenCalledWith({
      email: httpRequest.body.email,
      document: httpRequest.body.document,
      productId: httpRequest.body.productId,
      productCapacity: httpRequest.body.productCapacity,
    });
  });

  it('should return 500 if Decrypter throws', async () => {
    const { sut, decrypterStub } = makeSut();
    jest.spyOn(decrypterStub, 'decrypt').mockRejectedValueOnce(new Error());
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it('should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it('should return 500 if CPFValidator throws', async () => {
    const { sut, cpfValidatorStub } = makeSut();
    jest.spyOn(cpfValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it('should return 500 if AddSubscription throws', async () => {
    const { sut, addSubscriptionStub } = makeSut();
    jest.spyOn(addSubscriptionStub, 'add').mockRejectedValueOnce(new Error());
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it('should return 200 if valid data is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(success(makeFakeSubscription()));
  });
});
