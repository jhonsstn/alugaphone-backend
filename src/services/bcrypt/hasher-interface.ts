export default interface Hasher {
  encrypt(password: string): Promise<string>;
}
