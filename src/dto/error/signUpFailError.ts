import { CustomError } from './customError';

export class SignUpFailError extends CustomError {
  fieldName: string;

  constructor(fieldName?: string, message?: string) {
    super(message);
    this.name = `SignUpFailed, ${fieldName} is invalid`;
    this.fieldName = fieldName;
  }
}
