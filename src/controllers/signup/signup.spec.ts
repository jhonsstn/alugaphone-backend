import { faker } from '@faker-js/faker';
import MissingParamError from '../errors/missing-param-error';
import SignUpController from './signup';

type Account = {
  name: string;
  email: string;
  document: string;
  password: string;
};

const randomAccount: Account = {
  name: faker.name.firstName(),
  email: faker.internet.email(),
  document: faker.random.numeric(11),
  password: faker.internet.password(8),
};

describe('SignUp Controller', () => {
  it('should return 400 if no name is provided', async () => {
    const sut = new SignUpController();
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
    const sut = new SignUpController();
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
    const sut = new SignUpController();
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
    const sut = new SignUpController();
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
});
