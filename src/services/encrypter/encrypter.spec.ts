import bcrypt from 'bcrypt';
import BcryptAdapter from './encrypter';

const SALT = 12;

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return Promise.resolve('hash');
  },
}));

describe('Encrypter', () => {
  it('should return a encrypted password', async () => {
    const sut = new BcryptAdapter(SALT);
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    const password = await sut.encrypt('any_password');
    expect(hashSpy).toHaveBeenCalledWith('any_password', SALT);
  });
});
