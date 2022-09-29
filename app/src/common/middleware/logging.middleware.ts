
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggingService } from '../../logging/logging.service';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
    constructor(private logger: LoggingService) { }

    use(req: Request, res: Response, next: NextFunction) {
        this.logger.debug(`[${req.method}]: ${req.originalUrl}`);
        next();
    }
}

