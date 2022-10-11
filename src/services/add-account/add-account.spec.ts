import { AccountModel } from '../../models/account';
import AddAccountRepository from '../../repositories/add-account-repository';
import Hasher from '../bcrypt/hasher-interface';
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

const makeEncrypter = (): Hasher => {
  class EncrypterStub implements Hasher {
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
  encrypterStub: Hasher;
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
  it('should call Hasher with correct password', () => {
    const { sut, encrypterStub } = makeSut();
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');
    const accountData = makeFakeAccountData();
    sut.add(accountData);
    expect(encryptSpy).toHaveBeenCalledWith(accountData.password);
  });

  it('should throw if Hasher throws', async () => {
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

  it('should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    jest
      .spyOn(addAccountRepositoryStub, 'add')
      .mockRejectedValueOnce(new Error());
    const accountData = makeFakeAccountData();
    const promise = sut.add(accountData);
    await expect(promise).rejects.toThrow();
  });

  it('should return an account on success', async () => {
    const { sut } = makeSut();
    const accountData = makeFakeAccountData();
    const account = await sut.add(accountData);
    const { password, ...accountWithoutPassword } = makeFakeAccount();
    expect(account).toEqual(accountWithoutPassword);
  });
});
