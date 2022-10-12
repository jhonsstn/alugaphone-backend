import validator from 'validator';
import { AccountModel } from '../../models/account';
import GetAccountByEmailRepository from '../../repositories/get-account-by-email-repository';
import EmailValidatorAdapter from './email-validator';

jest.mock('validator', () => ({
  isEmail(): boolean {
    return true;
  },
}));

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  document: 'valid_document',
  password: 'encrypted_password',
});

const makeGetAccountByEmailRepository = (): GetAccountByEmailRepository => {
  class GetAccountByEmailRepositoryStub implements GetAccountByEmailRepository {
    async getAccountByEmail(): Promise<AccountModel> {
      return Promise.resolve(makeFakeAccount());
    }
  }
  return new GetAccountByEmailRepositoryStub();
};

interface SutTypes {
  sut: EmailValidatorAdapter;
  getAccountByEmailRepositoryStub: GetAccountByEmailRepository;
}

const makeSut = (): SutTypes => {
  const getAccountByEmailRepositoryStub = makeGetAccountByEmailRepository();
  const sut = new EmailValidatorAdapter(getAccountByEmailRepositoryStub);
  return {
    sut,
    getAccountByEmailRepositoryStub,
  };
};

describe('EmailValidatorAdapter', () => {
  it('should return false if validator returns false', () => {
    const { sut } = makeSut();
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);
    const isEmailValid = sut.isValid('invalid_email');
    expect(isEmailValid).toBeFalsy();
  });

  it('should return true if validator returns true', () => {
    const { sut } = makeSut();
    const isEmailValid = sut.isValid('any_email@mail.com');
    expect(isEmailValid).toBeTruthy();
  });

  it('should call validator with correct email', () => {
    const { sut } = makeSut();
    const isEmailSpy = jest.spyOn(validator, 'isEmail');
    sut.isValid('any_email@mail.com');
    expect(isEmailSpy).toHaveBeenCalledWith('any_email@mail.com');
  });

  it('should throw if GetAccountByEmailRepository throws', async () => {
    const { sut, getAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(getAccountByEmailRepositoryStub, 'getAccountByEmail')
      .mockReturnValueOnce(Promise.reject(new Error()));
    const promise = sut.checkIfAccountExists('any_email@mail.com');
    await expect(promise).rejects.toThrow();
  });

  it('should return true if GetAccountByEmailRepository returns an account', async () => {
    const { sut } = makeSut();
    const account = await sut.checkIfAccountExists('any_email@mail.com');
    expect(account).toBeTruthy();
  });

  it('should return false if GetAccountByEmailRepository returns null', async () => {
    const { sut, getAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(getAccountByEmailRepositoryStub, 'getAccountByEmail')
      .mockReturnValueOnce(Promise.resolve(null));
    const account = await sut.checkIfAccountExists('any_email@mail.com');
    expect(account).toBeFalsy();
  });
});
