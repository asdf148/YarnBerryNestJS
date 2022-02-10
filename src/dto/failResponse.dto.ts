import { ApiProperty } from '@nestjs/swagger';

export class FailResponseDTO {
  constructor(status?: string, message?: string) {
    this.status = status ?? 'Fail';
    this.message = message ?? 'No Message';
  }

  @ApiProperty({ description: '응답 상태' })
  public status: string;

  @ApiProperty({ description: '응답 메시지' })
  public message: string;
}
