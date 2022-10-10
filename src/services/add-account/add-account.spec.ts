import { AccountModel } from '../../models/account';
import AddAccountRepository from '../../repositories/interfaces/add-account-repository';
import Encrypter from '../encrypter/encrypter-interface';
import DbAddAccount from './add-account';
import { AddAccountModel } from './add-account-interface';

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  document: 'valid_document',
  password: 'encrypted_password',
});

const makeFakeAccountData = (): AddAccountModel => ({
  name: 'valid_name',
  email: 'valid_email@mail.com',
  document: 'valid_document',
  password: 'valid_password',
});

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    encrypt(_password: string): Promise<string> {
      return Promise.resolve('encrypted_password');
    }
  }
  return new EncrypterStub();
};

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(
      _account: AddAccountModel,
    ): Promise<Omit<AccountModel, 'password'>> {
      const { password, ...accountWithoutPassword } = makeFakeAccount();
      return Promise.resolve(accountWithoutPassword);
    }
  }
  return new AddAccountRepositoryStub();
};

interface SutTypes {
  sut: DbAddAccount;
  encrypterStub: Encrypter;
  addAccountRepositoryStub: AddAccountRepository;
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub);
  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub,
  };
};

describe('AddAccount', () => {
  it('should call Encrypter with correct password', () => {
    const { sut, encrypterStub } = makeSut();
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');
    const accountData = makeFakeAccountData();
    sut.add(accountData);
    expect(encryptSpy).toHaveBeenCalledWith(accountData.password);
  });

  it('should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut();
    jest.spyOn(encrypterStub, 'encrypt').mockRejectedValueOnce(new Error());
    const accountData = makeFakeAccountData();
    const promise = sut.add(accountData);
    await expect(promise).rejects.toThrow();
  });

  it('should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');
    const accountData = makeFakeAccountData();
    await sut.add(accountData);
    expect(addSpy).toHaveBeenCalledWith({
      name: accountData.name,
      email: accountData.email,
      document: accountData.document,
      password: 'encrypted_password',
    });
  });
});
