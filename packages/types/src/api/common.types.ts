/**
 * Standard API response envelope.
 * Every NestJS endpoint wraps its payload in this shape via
 * ResponseTransformInterceptor (introduced in M07).
 *
 * This file is intentionally minimal in M01 — it exists so that
 * apps/web and apps/api can both import @gcos/types successfully.
 * Full DTO shapes (DashboardResponse, AcademyModule, etc.) are added
 * incrementally as their owning modules are built (M09–M15).
 */
export interface ApiMeta {
  total?: number;
  page?: number;
  perPage?: number;
  totalPages?: number;
  duration_ms?: number;
}

export interface ApiSuccessResponse<T> {
  data: T;
  meta?: ApiMeta;
}

export interface ApiErrorDetail {
  field?: string;
  message: string;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: ApiErrorDetail[];
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
