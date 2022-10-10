import { cpf } from 'cpf-cnpj-validator';
import CPFValidator from './cpf-validator-interface';

export default class CPFValidatorAdapter implements CPFValidator {
  isValid(document: string): boolean {
    return cpf.isValid(document);
  }
}
