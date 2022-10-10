import validator, { cpf } from 'cpf-cnpj-validator';
import CPFValidatorAdapter from './cpf-validator';

jest.mock('cpf-cnpj-validator', () => ({
  cpf: {
    isValid(): boolean {
      return true;
    },
  },
}));

describe('CPFValidatorAdapter', () => {
  it('should return false if validator returns false', () => {
    const sut = new CPFValidatorAdapter();
    jest.spyOn(cpf, 'isValid').mockReturnValueOnce(false);
    const isCPFValid = sut.isValid('invalid_cpf');
    expect(isCPFValid).toBeFalsy();
  });

  it('should return true if validator returns true', () => {
    const sut = new CPFValidatorAdapter();
    const isCPFValid = sut.isValid('valid_cpf');
    expect(isCPFValid).toBeTruthy();
  });
});
