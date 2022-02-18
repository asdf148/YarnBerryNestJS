import { CustomError } from '../../../dto/error/customError';

export class GetItemFailError extends CustomError {
  public name = 'GetItemFail';

  constructor(message?: string) {
    super(message ?? 'Get Item Failed');
    Object.setPrototypeOf(this, GetItemFailError.prototype);
    Error.captureStackTrace && Error.captureStackTrace(this, CustomError);
  }
}
