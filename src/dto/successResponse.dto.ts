export class SuccessResponseDTO<T> {
  public status = 'Success';

  constructor(public message?: string, public data?: T) {}
}
