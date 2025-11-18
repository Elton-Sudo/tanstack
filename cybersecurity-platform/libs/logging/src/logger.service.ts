import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import pino from 'pino';

@Injectable()
export class LoggerService implements NestLoggerService {
  private logger: pino.Logger;

  constructor() {
    const isDevelopment = process.env.NODE_ENV !== 'production';

    this.logger = pino({
      level: process.env.LOG_LEVEL || 'info',
      formatters: {
        level: (label) => {
          return { level: label.toUpperCase() };
        },
      },
      transport: isDevelopment
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
              ignore: 'pid,hostname',
              singleLine: false,
            },
          }
        : undefined,
      timestamp: pino.stdTimeFunctions.isoTime,
    });
  }

  log(message: string, context?: string) {
    this.logger.info({ context }, message);
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error({ context, trace }, message);
  }

  warn(message: string, context?: string) {
    this.logger.warn({ context }, message);
  }

  debug(message: string, context?: string) {
    this.logger.debug({ context }, message);
  }

  verbose(message: string, context?: string) {
    this.logger.trace({ context }, message);
  }
}
