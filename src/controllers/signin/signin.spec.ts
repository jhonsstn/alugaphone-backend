import {
  Authentication,
  AuthenticationParams,
  AuthenticationResult,
} from '../../services/authentication/authentication-interface';
import EmailValidator from '../../services/email-validator/email-validator-interface';
import InvalidParamError from '../errors/invalid-param-error';
import MissingParamError from '../errors/missing-param-error';
import {
  badRequest,
  serverError,
  success,
  unauthorized,
} from '../helpers/http';
import { HttpRequest, HttpResponse } from '../interfaces/http';
import SignInController from './signin';

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password',
  },
});

interface SutType {
  sut: SignInController;
  emailValidatorStub: EmailValidator;
  authenticationStub: Authentication;
}

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

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(
      _authenticationParams: AuthenticationParams,
    ): Promise<AuthenticationResult | null> {
      return Promise.resolve({
        token: 'any_token',
        user: { id: 'any_id', name: 'any_name', email: 'any_email' },
      });
    }
  }
  return new AuthenticationStub();
};

const makeSut = (): SutType => {
  const emailValidatorStub = makeEmailValidator();
  const authenticationStub = makeAuthentication();
  const sut = new SignInController(emailValidatorStub, authenticationStub);
  return {
    sut,
    emailValidatorStub,
    authenticationStub,
  };
};

describe('Login Controller', () => {
  it('should return 400 if no email is provided', async () => {
    const { sut } = makeSut();
    const httpRequest: HttpRequest = {
      body: {
        password: 'any_password',
      },
    };
    const httpResponse: HttpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  });

  it('should return 400 if no password is provided', async () => {
    const { sut } = makeSut();
    const httpRequest: HttpRequest = {
      body: {
        email: 'any_email@mail.com',
      },
    };
    const httpResponse: HttpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
  });

  it('should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');
    const httpRequest: HttpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com');
  });

  it('should return 400 if in invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);
    const httpRequest: HttpRequest = makeFakeRequest();
    const httpResponse: HttpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')));
  });

  it('should return 500 if EmailValidator throws an exception', async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpRequest: HttpRequest = makeFakeRequest();
    const httpResponse: HttpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it('should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut();
    const authSpy = jest.spyOn(authenticationStub, 'auth');
    const httpRequest: HttpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(authSpy).toHaveBeenCalledWith({
      email: 'any_email@mail.com',
      password: 'any_password',
    });
  });

  it('should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut();
    jest
      .spyOn(authenticationStub, 'auth')
      .mockReturnValueOnce(Promise.resolve(null));
    const httpRequest: HttpRequest = makeFakeRequest();
    const httpResponse: HttpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(unauthorized());
  });

  it('should return 500 if Authentication throws an exception', async () => {
    const { sut, authenticationStub } = makeSut();
    jest.spyOn(authenticationStub, 'auth').mockRejectedValue(new Error());
    const httpRequest: HttpRequest = makeFakeRequest();
    const httpResponse: HttpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it('should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut();
    const httpRequest: HttpRequest = makeFakeRequest();
    const httpResponse: HttpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(
      success({
        token: 'any_token',
        user: { id: 'any_id', name: 'any_name', email: 'any_email' },
      }),
    );
  });
});
