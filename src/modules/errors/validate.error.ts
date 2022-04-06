export default class ValidateError extends Error {
  constructor(public message: string, private status?: number) {
    super(message);
    this.status = status || 400;
    this.name = "Validate Error";
  }
}
