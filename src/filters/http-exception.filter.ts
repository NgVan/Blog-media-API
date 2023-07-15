/* eslint-disable prettier/prettier */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    // const language = <string>request.headers['accept-language'];
    const message = exception.getResponse() as {
      key: string;
      args: Record<string, unknown>;
    };

    const responseBody = {
      status: 'error',
      errors: [
        {
          code: status,
          title: message['error'],
          detail: message['message'],
          timestamp: new Date().toISOString(),
          path: request.url,
        },
      ],
    };
    // if (status === HttpStatus.NOT_FOUND) {
    //   response.status(status).json();
    // } else {
    //   response.status(status).json(responseBody);
    // }
    response.status(status).json(responseBody);
  }
}
