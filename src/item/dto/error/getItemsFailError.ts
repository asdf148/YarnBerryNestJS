import { CustomError } from '../../../dto/error/customError';

export class GetItemsFailError extends CustomError {
  public name = 'GetItemsFail';

  constructor(message?: string) {
    super(message ?? 'Get Items Failed');
    Object.setPrototypeOf(this, GetItemsFailError.prototype);
    Error.captureStackTrace && Error.captureStackTrace(this, CustomError);
  }
}
