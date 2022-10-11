import { AccountModel } from '../../models/account';
import GetAccountByEmailRepository from '../../repositories/get-account-by-email-repository';
import Authentication from './authentication';
import { AuthenticationParams } from './authentication-interface';

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  document: 'valid_document',
  password: 'encrypted_password',
});

const makeFakeLoginData = (): AuthenticationParams => ({
  email: 'any_email@mail.com',
  password: 'any_password',
});

const makeGetAccountByEmailRepository = (): GetAccountByEmailRepository => {
  class GetAccountByEmailRepositoryStub implements GetAccountByEmailRepository {
    async getAccountByEmail(_email: string): Promise<AccountModel | null> {
      return Promise.resolve(makeFakeAccount());
    }
  }
  return new GetAccountByEmailRepositoryStub();
};

interface SutTypes {
  sut: Authentication;
  getAccountByEmailRepositoryStub: GetAccountByEmailRepository;
}

const makeSut = (): SutTypes => {
  const getAccountByEmailRepositoryStub = makeGetAccountByEmailRepository();
  const sut = new Authentication(getAccountByEmailRepositoryStub);
  return {
    sut,
    getAccountByEmailRepositoryStub,
  };
};

describe('Authentication', () => {
  it('should call GetAccountByEmailRepository with correct email', async () => {
    const { sut, getAccountByEmailRepositoryStub } = makeSut();
    const getAccountByEmailSpy = jest.spyOn(
      getAccountByEmailRepositoryStub,
      'getAccountByEmail',
    );
    await sut.auth(makeFakeLoginData());
    expect(getAccountByEmailSpy).toHaveBeenCalledWith(
      makeFakeLoginData().email,
    );
  });

  it('should return null if GetAccountByEmailRepository returns null', async () => {
    const { sut, getAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(getAccountByEmailRepositoryStub, 'getAccountByEmail')
      .mockReturnValueOnce(Promise.resolve(null));
    const account = await sut.auth(makeFakeLoginData());
    expect(account).toBeNull();
  });
});
