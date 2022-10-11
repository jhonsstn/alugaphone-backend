export default interface Hasher {
  encrypt(plaintext: string): Promise<string>;
}
