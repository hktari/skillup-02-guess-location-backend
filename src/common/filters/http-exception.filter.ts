import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter extends BaseExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        if (exception instanceof HttpException) {
            super.catch(exception as HttpException, host)
        } else {
            const ctx = host.switchToHttp();
            const response = ctx.getResponse<Response>();
            const request = ctx.getRequest<Request>();

            response
                .status(500)
                .json({
                    path: request.url,
                    timestamp: new Date().toISOString(),
                    statusCode: 500,
                    error: exception.toString(),
                    message: 'Internal Server Error',
                });
        }
    }
}
