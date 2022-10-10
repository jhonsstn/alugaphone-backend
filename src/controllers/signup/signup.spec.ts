import { AccountModel } from '../../models/account';
import AddAccount, {
  AddAccountModel,
} from '../../services/add-account/add-account-interface';
import CPFValidator from '../../services/cpf-validator/cpf-validator-interface';
import EmailValidator from '../../services/email-validator/email-validator-interface';
import InvalidParamError from '../errors/invalid-param-error';
import MissingParamError from '../errors/missing-param-error';
import { success } from '../helpers/http';
import { HttpRequest } from '../interfaces/http';
import SignUpController from './signup';

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    document: 'any_document',
    password: 'any_password',
  },
});

const makeFakeAccount = (): Omit<AccountModel, 'password'> => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  document: 'valid_document',
});

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(_email: string): boolean {
      return true;
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

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(
      _account: AddAccountModel,
    ): Promise<Omit<AccountModel, 'password'>> {
      return Promise.resolve(makeFakeAccount());
    }
  }
  return new AddAccountStub();
};

type SutTypes = {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
  cpfValidatorStub: CPFValidator;
  addAccountStub: AddAccount;
};

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const cpfValidatorStub = makeCPFValidator();
  const addAccountStub = makeAddAccount();
  const sut = new SignUpController(
    emailValidatorStub,
    cpfValidatorStub,
    addAccountStub,
  );
  return {
    sut,
    emailValidatorStub,
    cpfValidatorStub,
    addAccountStub,
  };
};

describe('SignUp Controller', () => {
  it('should return 400 if no name is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        document: 'any_document',
        password: 'any_password',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.body).toEqual(new MissingParamError('name'));
  });

  it('should return 400 if no email is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        document: 'any_document',
        password: 'any_password',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });

  it('should return 400 if no document is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.body).toEqual(new MissingParamError('document'));
  });

  it('should return 400 if no password is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        document: 'any_document',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  });

  it('should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.body).toEqual(new InvalidParamError('email'));
  });

  it('should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email);
  });

  it('should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
  });

  it('should return 400 if an invalid cpf is provided', async () => {
    const { sut, cpfValidatorStub } = makeSut();
    jest.spyOn(cpfValidatorStub, 'isValid').mockReturnValueOnce(false);
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.body).toEqual(new InvalidParamError('document'));
  });

  it('should call CPFValidator with correct cpf', async () => {
    const { sut, cpfValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(cpfValidatorStub, 'isValid');
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.document);
  });

  it('should return 500 if CPFValidator throws', async () => {
    const { sut, cpfValidatorStub } = makeSut();
    jest.spyOn(cpfValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
  });

  it('should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut();
    const addSpy = jest.spyOn(addAccountStub, 'add');
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(addSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  it('should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
  });

  it('should return 200 if valid data is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(success(makeFakeAccount()));
  });
});
