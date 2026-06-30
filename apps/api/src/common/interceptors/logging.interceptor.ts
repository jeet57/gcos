import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Logs method, path, status, and duration for every request (TAD §3.5).
 * Disabled in the test environment to keep test output clean.
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (process.env.NODE_ENV === 'test') {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const start = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse();
          const duration = Date.now() - start;
          this.logger.log(`${method} ${url} ${response.statusCode} ${duration}ms`);
        },
        error: (err) => {
          const duration = Date.now() - start;
          const status = err?.status ?? 500;
          this.logger.log(`${method} ${url} ${status} ${duration}ms`);
        },
      }),
    );
  }
}
