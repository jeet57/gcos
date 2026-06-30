import 'reflect-metadata';
import { ValidationPipe, HttpStatus } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

/**
 * M07 scope: full bootstrap per TAD §3 (NestJS Bootstrap — App Skeleton
 * + Global Providers). FastifyAdapter, global ValidationPipe, CORS, and
 * Swagger (dev only) are all wired here. The global guard/interceptors/
 * filter are bound as providers in app.module.ts instead, since they
 * need Nest's DI container to inject Reflector/JwtService/HttpAdapterHost.
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  );

  const corsOrigins = [
    'http://localhost:3000',
    process.env.PRODUCTION_WEB_ORIGIN,
  ].filter((origin): origin is string => Boolean(origin));

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('GCOS API')
      .setDescription('German Career Operating System — backend API')
      .setVersion('0.1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = process.env.PORT ? Number(process.env.PORT) : 3001;
  await app.listen(port, '0.0.0.0');
  // eslint-disable-next-line no-console
  console.log(`GCOS API running on http://localhost:${port}`);
}

bootstrap();
