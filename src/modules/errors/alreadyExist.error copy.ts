export default class DoesNotExistError extends Error {
  constructor(public message: string, private status?: number) {
    super(message);
    this.status = status || 404;
    this.name = "Does Not exist Error";
  }
}
