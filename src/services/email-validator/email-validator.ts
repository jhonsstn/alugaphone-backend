import validator from 'validator';
import EmailValidator from './email-validator-interface';

export default class EmailValidatorAdapter implements EmailValidator {
  isValid(email: string): boolean {
    return validator.isEmail(email);
  }
}
