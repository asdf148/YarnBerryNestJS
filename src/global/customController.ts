import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { FailResponseDTO } from '../dto/failResponse.dto';
import { SuccessResponseDTO } from '../dto/successResponse.dto';

export class CustomController {
  returnSuccessResponseWithJSON<T>(
    status: string,
    message: string,
    data: T,
    res: Response,
    httpStatusCode: number,
  ) {
    const response: SuccessResponseDTO<T> = new SuccessResponseDTO<T>(
      status,
      message,
      data,
    );

    switch (httpStatusCode) {
      case HttpStatus.OK:
        return res.status(HttpStatus.OK).json(response);
      case HttpStatus.CREATED:
        return res.status(HttpStatus.CREATED).json(response);
    }
  }

  // null 확인 지우기
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
