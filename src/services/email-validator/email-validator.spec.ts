import validator from 'validator';
import EmailValidatorAdapter from './email-validator';

jest.mock('validator', () => ({
  isEmail(): boolean {
    return true;
  },
}));

describe('EmailValidator', () => {
  test('should return false if validator returns false', () => {
    const sut = new EmailValidatorAdapter();
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);
    const isEmailValid = sut.isValid('invalid_email@mail.com');
    expect(isEmailValid).toBeFalsy();
  });
});
