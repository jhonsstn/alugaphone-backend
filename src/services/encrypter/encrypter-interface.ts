export default interface Encrypter {
  encrypt(password: string): Promise<string>;
}
