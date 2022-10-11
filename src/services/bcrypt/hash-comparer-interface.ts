export default interface HashComparer {
  compare(plaintext: string, digest: string): Promise<boolean>;
}
