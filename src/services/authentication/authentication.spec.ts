import { AccountModel } from '../../models/account';
import GetAccountByEmailRepository from '../../repositories/get-account-by-email-repository';
import HashComparer from '../hash-comparer/hash-comparer-interface';
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

const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare(_password: string, _hash: string): Promise<boolean> {
      return Promise.resolve(true);
    }
  }
  return new HashComparerStub();
};

interface SutTypes {
  sut: Authentication;
  getAccountByEmailRepositoryStub: GetAccountByEmailRepository;
  hashComparerStub: HashComparer;
}

const makeSut = (): SutTypes => {
  const getAccountByEmailRepositoryStub = makeGetAccountByEmailRepository();
  const hashComparerStub = makeHashComparer();
  const sut = new Authentication(
    getAccountByEmailRepositoryStub,
    hashComparerStub,
  );
  return {
    sut,
    getAccountByEmailRepositoryStub,
    hashComparerStub,
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

  it('should throw if GetAccountByEmailRepository throws', async () => {
    const { sut, getAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(getAccountByEmailRepositoryStub, 'getAccountByEmail')
      .mockRejectedValueOnce(new Error());
    const promise = sut.auth(makeFakeLoginData());
    await expect(promise).rejects.toThrow();
  });

  it('should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut();
    const compareSpy = jest.spyOn(hashComparerStub, 'compare');
    await sut.auth(makeFakeLoginData());
    expect(compareSpy).toHaveBeenCalledWith(
      makeFakeLoginData().password,
      makeFakeAccount().password,
    );
  });

  it('should return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut();
    jest.spyOn(hashComparerStub, 'compare').mockResolvedValueOnce(false);
    const account = await sut.auth(makeFakeLoginData());
    expect(account).toBeNull();
  });

  it('should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut();
    jest.spyOn(hashComparerStub, 'compare').mockRejectedValueOnce(new Error());
    const promise = sut.auth(makeFakeLoginData());
    await expect(promise).rejects.toThrow();
  });
});
