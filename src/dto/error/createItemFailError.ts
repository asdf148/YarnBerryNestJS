import { CustomError } from './customError';

export class CreateItemFail extends CustomError {
  public name = 'CreateItemFail';

  constructor(message?: string) {
    super(message ?? 'Create Item Failed');
    Object.setPrototypeOf(this, CreateItemFail.prototype);
    Error.captureStackTrace && Error.captureStackTrace(this, CustomError);
  }
}
