export default class DBError extends Error {
  constructor(public message: string, private status?: number) {
    super(message);
    this.status = status || 500;
    this.name = "DB Error";
  }
}
