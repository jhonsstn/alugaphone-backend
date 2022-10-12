export default interface EmailValidator {
  isValid: (email: string) => boolean;
  checkIfAccountExists: (email: string) => Promise<boolean>;
}
