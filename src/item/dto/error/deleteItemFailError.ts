import { CustomError } from '../../../dto/error/customError';

export class DeleteItemFailError extends CustomError {
  public name = 'DeleteItemFail';

  constructor(message?: string) {
    super(message ?? 'Delete Item Failed');
    Object.setPrototypeOf(this, DeleteItemFailError.prototype);
    Error.captureStackTrace && Error.captureStackTrace(this, CustomError);
  }
}
