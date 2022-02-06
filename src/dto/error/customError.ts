export class CustomError extends Error {
  name: string;

  constructor(message?: string) {
    super(message);
    this.name = new.target.name;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace && Error.captureStackTrace(this, CustomError);
  }
}
