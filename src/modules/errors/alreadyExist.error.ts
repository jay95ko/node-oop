export default class AlreadyExistError extends Error {
  constructor(public message: string, private status?: number) {
    super(message);
    this.status = status || 409;
    this.name = "Already exist Error";
  }
}
