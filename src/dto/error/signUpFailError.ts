import { CustomError } from './customError';

export class SignUpFailError extends CustomError {
  public name = 'SignUpFailed';

  constructor(fieldName?: string) {
    super(`SignUp Failed, ${fieldName} is invalid`);
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace && Error.captureStackTrace(this, SignUpFailError);
  }
}
