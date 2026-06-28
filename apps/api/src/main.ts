import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * M01 scope: minimal bootstrap so the NestJS app starts and serves
 * GET /health. CORS, Swagger, global ValidationPipe / Guards /
 * Interceptors / Filters, and the FastifyAdapter are all introduced
 * in M07 per TAD Section 3 (NestJS Bootstrap — App Skeleton + Global
 * Providers). Do not add them here — that is out of M01 scope.
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ? Number(process.env.PORT) : 3001;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`GCOS API running on http://localhost:${port}`);
}

bootstrap();
