import { faker } from '@faker-js/faker';
import EmailValidator from '../../services/email-validator/email-validator-interface';
import InvalidParamError from '../errors/invalid-param-error';
import MissingParamError from '../errors/missing-param-error';
import SignUpController from './signup';

type Account = {
  name: string;
  email: string;
  document: string;
  password: string;
};

const randomAccount: Account = {
  name: faker.name.fullName(),
  email: faker.internet.email(),
  document: faker.random.numeric(11),
  password: faker.internet.password(8),
};

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(_email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

type SutTypes = {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
};

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const sut = new SignUpController(emailValidatorStub);
  return { sut, emailValidatorStub };
};

describe('SignUp Controller', () => {
  it('should return 400 if no name is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: randomAccount.email,
        document: randomAccount.document,
        password: randomAccount.password,
        passwordConfirmation: randomAccount.password,
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.body).toEqual(new MissingParamError('name'));
  });

  it('should return 400 if no email is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: randomAccount.name,
        document: randomAccount.document,
        password: randomAccount.password,
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });

  it('should return 400 if no document is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: randomAccount.name,
        email: randomAccount.email,
        password: randomAccount.password,
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.body).toEqual(new MissingParamError('document'));
  });

  it('should return 400 if no password is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: randomAccount.name,
        email: randomAccount.email,
        document: randomAccount.document,
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  });

  it('should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);
    const httpRequest = {
      body: {
        name: randomAccount.name,
        email: randomAccount.email,
        document: randomAccount.document,
        password: randomAccount.password,
        passwordConfirmation: randomAccount.password,
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.body).toEqual(new InvalidParamError('email'));
  });

  it('should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');
    const httpRequest = {
      body: {
        name: randomAccount.name,
        email: randomAccount.email,
        document: randomAccount.document,
        password: randomAccount.password,
        passwordConfirmation: randomAccount.password,
      },
    };
    await sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith(randomAccount.email);
  });

  it('should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpRequest = {
      body: {
        name: randomAccount.name,
        email: randomAccount.email,
        document: randomAccount.document,
        password: randomAccount.password,
        passwordConfirmation: randomAccount.password,
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
  });
});
