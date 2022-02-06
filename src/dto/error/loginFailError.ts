import { CustomError } from './customError';

export class LoginFailError extends CustomError {
  constructor(message?: string) {
    super(message);
    this.name = 'LoginFailed';
  }
}
