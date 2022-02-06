export class SuccessResponseDTO<T> {
  constructor(
    public status: string = 'Success',
    public message: string,
    public data: T,
  ) {}
}
