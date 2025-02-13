import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from "@nestjs/common";

import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const { method, originalUrl, ip } = request;

    this.logger.log(
      `[${new Date().toISOString()}] Request - ${method} ${originalUrl} from ${ip}`,
    );

    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const statusCode = response.statusCode;

        if (statusCode >= 0 && statusCode < 300) {
          this.logger.log(
            `[${new Date().toISOString()}] Response - ${method} ${originalUrl} ${statusCode}`,
          );
        } else {
          this.logger.error(
            `[${new Date().toISOString()}] Response - ${method} ${originalUrl} ${statusCode}`,
          );
        }

        const responseTimeMs = Date.now() - start;
        this.logger.log(
          `[${new Date().toISOString()}] Response Time - ${method} ${originalUrl}: ${responseTimeMs}ms`,
        );
      }),
    );
  }
}
