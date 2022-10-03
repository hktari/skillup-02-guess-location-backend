import { Injectable, Scope, ConsoleLogger } from '@nestjs/common';

@Injectable()
export class LoggingService extends ConsoleLogger {}
