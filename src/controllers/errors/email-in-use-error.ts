export default class EmailInUseError extends Error {
  constructor() {
    super('User already exists with this email');
    this.name = 'EmailInUseError';
  }
}
