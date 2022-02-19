import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { FailResponseDTO } from 'src/dto/failResponse.dto';

export class CustomController {
  returnBadRequestResponseWithJSON(
    res: Response,
    errorStatus?: string,
    errorMessage?: string,
  ): Response<any, Record<string, any>> {
    const response: FailResponseDTO = new FailResponseDTO(
      errorStatus ?? 'Fail',
      errorMessage ?? 'Something went wrong',
    );

    return res.status(HttpStatus.BAD_REQUEST).json(response);
  }
}
