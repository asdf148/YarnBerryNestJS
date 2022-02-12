export class CustomError extends Error {
  public message: string;
  public name = 'CustomError';

  constructor(message?: string) {
    super(message ?? 'Error Occurred');
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace && Error.captureStackTrace(this, CustomError);
  }
}
