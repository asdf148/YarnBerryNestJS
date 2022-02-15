import { CustomError } from './customError';

export class ModifyItemFail extends CustomError {
  public name = 'ModifyItemFail';

  constructor(message?: string) {
    super(message ?? 'Modify Item Failed');
    Object.setPrototypeOf(this, ModifyItemFail.prototype);
    Error.captureStackTrace && Error.captureStackTrace(this, CustomError);
  }
}
