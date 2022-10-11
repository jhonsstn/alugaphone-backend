import bcrypt from 'bcrypt';
import BcryptAdapter from './bcrypt-adapter';

const SALT = 12;

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return Promise.resolve('hash');
  },
}));

describe('Hasher', () => {
  it('should return a encrypted password', async () => {
    const sut = new BcryptAdapter(SALT);
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    const password = await sut.encrypt('any_password');
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
});