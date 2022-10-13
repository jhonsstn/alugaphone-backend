import jwt from 'jsonwebtoken';
import JwtAdapter from './jwt-adapter';
import { EncrypterParams } from './jwt-encrypt-interface';

jest.mock('jsonwebtoken', () => ({
  sign(): string {
    return 'any_token';
  },
  verify(): EncrypterParams {
    return {
      id: 'any_id',
      email: 'any_email@mail.com',
    };
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

  it('should call verify with correct values', async () => {
    const sut = new JwtAdapter('secret');
    const verifySpy = jest.spyOn(jwt, 'verify');
    await sut.decrypt('any_token');
    expect(verifySpy).toHaveBeenCalledWith('any_token', 'secret');
  });

  it('should return a value on verify success', async () => {
    const sut = new JwtAdapter('secret');
    const value = await sut.decrypt('any_token');
    expect(value).toEqual({
      id: 'any_id',
      email: 'any_email@mail.com',
    });
  });

  it('should return null if verify throws', async () => {
    const sut = new JwtAdapter('secret');
    jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
      throw new Error();
    });
    const value = await sut.decrypt('any_token');
    expect(value).toBeNull();
  });
});
