import jwt from 'jsonwebtoken';
import JwtAdapter from './jwt-adapter';

jest.mock('jsonwebtoken', () => ({
  async sign(): Promise<string> {
    return Promise.resolve('any_token');
  },
}));

describe('JwtAdapter', () => {
  it('should call sign with correct values', async () => {
    const sut = new JwtAdapter('secret');
    const signSpy = jest.spyOn(jwt, 'sign');
    await sut.encrypt({ id: 'any_id', email: 'any_email' });
    expect(signSpy).toHaveBeenCalledWith(
      { id: 'any_id', email: 'any_email' },
      'secret',
    );
  });

  it('should return a token on sign success', async () => {
    const sut = new JwtAdapter('secret');
    const token = await sut.encrypt({ id: 'any_id', email: 'any_email' });
    expect(token).toBe('any_token');
  });

  it('should throw if sign throws', async () => {
    const sut = new JwtAdapter('secret');
    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
      throw new Error();
    });
    const promise = sut.encrypt({ id: 'any_id', email: 'any_email' });
    await expect(promise).rejects.toThrow();
  });
});
