
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AppLogger } from '../services/app-logger.service';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
    constructor(private logger: AppLogger) { }

    use(req: Request, res: Response, next: NextFunction) {
        this.logger.log(`[${req.method}]: ${req.originalUrl}`);
        next();
    }
}

