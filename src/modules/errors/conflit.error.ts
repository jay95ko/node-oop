export default class ConflictError extends Error {
  constructor(public message: string, private status?: number) {
    super(message);
    this.status = status || 409;
    this.name = "Conflict Error";
  }
}
