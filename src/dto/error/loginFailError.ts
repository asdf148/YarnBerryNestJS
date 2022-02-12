import { CustomError } from './customError';

export class LoginFailError extends CustomError {
  public name = 'LoginFailed';

  constructor(message?: string) {
    super(message ?? 'Login Failed');
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace && Error.captureStackTrace(this, CustomError);
  }
}
