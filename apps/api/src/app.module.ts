import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';

import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { ResponseTransformInterceptor } from './common/interceptors/response-transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

import { AuthModule } from './modules/auth/auth.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { ReadinessScoreModule } from './modules/readiness-score/readiness-score.module';
import { AcademyModule } from './modules/academy/academy.module';
import { StudyModule } from './modules/study/study.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { PortfolioModule } from './modules/portfolio/portfolio.module';
import { GermanModule } from './modules/german/german.module';
import { NetworkingModule } from './modules/networking/networking.module';
import { InterviewsModule } from './modules/interviews/interviews.module';
import { ResumeModule } from './modules/resume/resume.module';
import { VisaModule } from './modules/visa/visa.module';
import { AiToolsModule } from './modules/ai-tools/ai-tools.module';
import { AlertsModule } from './modules/alerts/alerts.module';
import { ScheduledTasksModule } from './modules/scheduled-tasks/scheduled-tasks.module';

/**
 * M07 scope: all 13 feature module stubs registered, plus the global
 * providers from TAD §3.5 (ValidationPipe is bound in main.ts, since it
 * needs no DI; the guard/interceptors/filter are bound here via
 * APP_GUARD/APP_INTERCEPTOR/APP_FILTER so Nest's DI container can inject
 * Reflector/JwtService/HttpAdapterHost into them).
 *
 * JwtAuthGuard runs globally, so every route in every module below
 * 401s by default until M08 provides real JWTs — only @Public() routes
 * (currently just GET /health, plus the M16 internal trigger route)
 * bypass it.
 *
 * M16 adds ScheduleModule.forRoot() (registered once, globally, here —
 * per Nest convention, not owned by ScheduledTasksModule itself) plus
 * AlertsModule and ScheduledTasksModule.
 */
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({ global: true }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    DashboardModule,
    ReadinessScoreModule,
    AlertsModule,
    ScheduledTasksModule,
    AcademyModule,
    StudyModule,
    JobsModule,
    PortfolioModule,
    GermanModule,
    NetworkingModule,
    InterviewsModule,
    ResumeModule,
    VisaModule,
    AiToolsModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_INTERCEPTOR, useClass: ResponseTransformInterceptor },
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
  ],
})
export class AppModule {}
