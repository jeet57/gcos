import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';

/**
 * M03 scope: PrismaModule is now registered — the schema exists (this
 * milestone) so PrismaService can be injected and tested per the M03
 * acceptance criteria ("PrismaService can be injected in a test NestJS
 * module with no errors").
 *
 * Feature module stubs for all 13 domains (auth, dashboard,
 * readiness-score, academy, study, jobs, portfolio, german, networking,
 * interviews, resume, visa, ai-tools) and the global providers (guards,
 * interceptors, filters, ValidationPipe) are still introduced in M07 —
 * not added here.
 */
@Module({
  imports: [PrismaModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
