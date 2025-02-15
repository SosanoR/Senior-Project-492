export class DuplicateAccountError extends Error {
  constructor() {
    super("Duplicate account found");
    this.name = "DuplicateAccountError";
  }
}