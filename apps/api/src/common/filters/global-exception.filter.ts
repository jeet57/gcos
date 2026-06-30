import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import type { ApiErrorResponse } from '@gcos/types';

/**
 * Catches all unhandled exceptions and returns the {error} half of the
 * ApiResponse<T> union from @gcos/types (TAD §3.5). Uses HttpAdapterHost
 * rather than calling res.status() directly, since main.ts runs on the
 * Fastify adapter, not Express.
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const { status, body } = this.buildResponse(exception);

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(exception instanceof Error ? exception.stack : exception);
    }

    httpAdapter.reply(ctx.getResponse(), body, status);
  }

  private buildResponse(exception: unknown): { status: number; body: ApiErrorResponse } {
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse();

      // class-validator's ValidationPipe throws a BadRequestException whose
      // getResponse() is { message: string[], error, statusCode } —
      // surface those as field-level details where possible.
      if (typeof response === 'object' && response !== null && 'message' in response) {
        const message = (response as { message: string | string[] }).message;
        const messages = Array.isArray(message) ? message : [message];
        const details = messages.length > 1 ? messages.map((m) => ({ message: m })) : undefined;
        return {
          status,
          body: {
            error: {
              code: this.codeForStatus(status),
              message: messages[0] ?? exception.message,
              ...(details ? { details } : {}),
            },
          },
        };
      }

      return {
        status,
        body: { error: { code: this.codeForStatus(status), message: exception.message } },
      };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      body: {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred.',
        },
      },
    };
  }

  private codeForStatus(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return 'BAD_REQUEST';
      case HttpStatus.UNAUTHORIZED:
        return 'UNAUTHORIZED';
      case HttpStatus.FORBIDDEN:
        return 'FORBIDDEN';
      case HttpStatus.NOT_FOUND:
        return 'NOT_FOUND';
      case HttpStatus.UNPROCESSABLE_ENTITY:
        return 'VALIDATION_ERROR';
      case HttpStatus.CONFLICT:
        return 'CONFLICT';
      default:
        return 'INTERNAL_ERROR';
    }
  }
}
