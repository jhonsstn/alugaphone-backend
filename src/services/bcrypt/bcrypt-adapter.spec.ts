import bcrypt from 'bcrypt';
import BcryptAdapter from './bcrypt-adapter';

const SALT = 12;

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return Promise.resolve('hash');
  },
  async compare(): Promise<boolean> {
    return Promise.resolve(true);
  },
}));

describe('BcryptAdapter', () => {
  it('should return a encrypted password', async () => {
    const sut = new BcryptAdapter(SALT);
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    await sut.encrypt('any_password');
    expect(hashSpy).toHaveBeenCalledWith('any_password', SALT);
  });

  it('should return a encrypted password', async () => {
    const sut = new BcryptAdapter(SALT);
    const password = await sut.encrypt('any_password');
    expect(password).toEqual('hash');
  });

  it('should throw if bcrypt throws', async () => {
    const sut = new BcryptAdapter(SALT);
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
      throw new Error();
    });
    const promise = sut.encrypt('any_password');
    await expect(promise).rejects.toThrow();
  });

  it('should return true if compare succeeds', async () => {
    const sut = new BcryptAdapter(SALT);
    const isValid = await sut.compare('any_password', 'any_hash');
    expect(isValid).toBeTruthy();
  });

  it('should return false if compare fails', async () => {
    const sut = new BcryptAdapter(SALT);
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => false);
    const isValid = await sut.compare('any_password', 'any_hash');
    expect(isValid).toBeFalsy();
  });

  it('should throw if compare throws', async () => {
    const sut = new BcryptAdapter(SALT);
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => {
      throw new Error();
    });
    const promise = sut.compare('any_password', 'any_hash');
    await expect(promise).rejects.toThrow();
  });
});
