import { CustomError } from './customError';

export class SignUpFailError extends CustomError {
  fieldName: string;

  constructor(fieldName?: string) {
    super(`SignUp Failed, ${fieldName} is invalid`);
    this.name = 'SignUpFailed';
    this.fieldName = fieldName;
  }
}
