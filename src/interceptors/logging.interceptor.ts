import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const { method, originalUrl, ip, headers } = request;
    const userAgent = headers['user-agent'] || 'Unknown';
    const timestamp = new Date().toISOString();

    this.logger.log(
      `Request [${timestamp}] ${method} ${originalUrl} - IP: ${ip} - User-Agent: ${userAgent}`,
    );

    const start = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const statusCode = response.statusCode;
          const responseTime = Date.now() - start;

          const logMessage = `Response [${new Date().toISOString()}] ${method} ${originalUrl} - Status: ${statusCode} - Duration: ${responseTime}ms`;

          if (statusCode >= 500) {
            this.logger.error(logMessage);
          } else if (statusCode >= 400) {
            this.logger.warn(logMessage);
          } else {
            this.logger.log(logMessage);
          }
        },
        error: (error) => {
          const responseTime = Date.now() - start;
          this.logger.error(
            `Error [${new Date().toISOString()}] ${method} ${originalUrl} - ${error.message} - Duration: ${responseTime}ms`,
          );
        },
      }),
    );
  }
}
