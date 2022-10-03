import { Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';
import { LoggingService } from '../../logging/logging.service';

@Catch()
export class HttpExceptionFilter extends BaseExceptionFilter {
  constructor(private logger: LoggingService) {
    super();
  }

  catch(exception: unknown, host: ArgumentsHost) {
    if (exception instanceof HttpException) {
      super.catch(exception as HttpException, host);
    } else {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();

      this.logger.error(
        request.url + ' Unhandled error occured.',
        exception.toString(),
      );

      response.status(500).json({
        path: request.url,
        timestamp: new Date().toISOString(),
        statusCode: 500,
        error: exception.toString(),
        message: 'Internal Server Error',
      });
    }
  }
}
