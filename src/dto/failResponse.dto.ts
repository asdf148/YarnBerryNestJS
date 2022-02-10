import { ResponseDTO } from './response.dto';

export class FailResponseDTO extends ResponseDTO {
  constructor(status?: string, message?: string) {
    super();
    this.status = status ?? 'Fail';
    this.message = message ?? 'No Message';
  }
}
