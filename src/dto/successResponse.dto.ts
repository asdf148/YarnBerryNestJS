import { ApiProperty } from '@nestjs/swagger';
import { ResponseDTO } from './response.dto';

export class SuccessResponseDTO<T> extends ResponseDTO {
  constructor(status?: string, message?: string, data?: T) {
    super();
    this.status = status ?? 'Success';
    this.message = message ?? 'No Message';
    this.data = data ?? 'No Data';
  }

  @ApiProperty({ description: '응답 결과' })
  public data: T | string;
}
