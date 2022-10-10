import validator from 'validator';
import EmailValidatorAdapter from './email-validator';

jest.mock('validator', () => ({
  isEmail(): boolean {
    return true;
  },
}));

describe('EmailValidator', () => {
  it('should return false if validator returns false', () => {
    const sut = new EmailValidatorAdapter();
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);
    const isEmailValid = sut.isValid('invalid_email');
    expect(isEmailValid).toBeFalsy();
  });

  it('should return true if validator returns true', () => {
    const sut = new EmailValidatorAdapter();
    const isEmailValid = sut.isValid('any_email@mail.com');
    expect(isEmailValid).toBeTruthy();
  });

  it('should call validator with correct email', () => {
    const sut = new EmailValidatorAdapter();
    const isEmailSpy = jest.spyOn(validator, 'isEmail');
    sut.isValid('any_email@mail.com');
    expect(isEmailSpy).toHaveBeenCalledWith('any_email@mail.com');
  });
});
