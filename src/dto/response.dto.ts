import { ApiProperty } from '@nestjs/swagger';

export class ResponseDTO {
  constructor() {
    this.status = 'ResponseDTO';
    this.message = 'If you see this message, that is server error';
  }

  @ApiProperty({ description: '응답 상태', example: 'Response Status' })
  public status: string;

  @ApiProperty({ description: '응답 메시지', example: 'Response Message' })
  public message: string;
}
