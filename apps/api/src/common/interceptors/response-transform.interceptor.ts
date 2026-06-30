import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import type { ApiSuccessResponse } from '@gcos/types';

/**
 * Wraps every successful response in the {data, meta} envelope
 * (TAD §3.5), matching ApiSuccessResponse<T> from @gcos/types.
 * Errors are handled separately by GlobalExceptionFilter, which
 * produces the {error} half of the ApiResponse<T> union.
 */
@Injectable()
export class ResponseTransformInterceptor<T> implements NestInterceptor<T, ApiSuccessResponse<T>> {
  intercept(_context: ExecutionContext, next: CallHandler<T>): Observable<ApiSuccessResponse<T>> {
    return next.handle().pipe(map((data) => ({ data })));
  }
}
