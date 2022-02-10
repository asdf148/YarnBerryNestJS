import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseDTO<T> {
  constructor(status?: string, message?: string, data?: T) {
    this.status = status ?? 'Success';
    this.message = message ?? 'No Message';
    this.data = data ?? 'No Data';
  }

  @ApiProperty({ description: '응답 상태' })
  public status: string;

  @ApiProperty({ description: '응답 메시지' })
  public message: string;

  @ApiProperty({ description: '응답 결과' })
  public data: T | string;
}
