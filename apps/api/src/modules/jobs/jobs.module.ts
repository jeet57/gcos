import { Module } from '@nestjs/common';

import { PrismaModule } from '../../prisma/prisma.module';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';

/**
 * M13: implemented module — application pipeline + company directory.
 * Two controllers (JobsController, CompaniesController) share one
 * module per the plan's file list; CompaniesService is exported in
 * case Networking (M15) wants to reuse company lookup later.
 */
@Module({
  imports: [PrismaModule],
  controllers: [JobsController, CompaniesController],
  providers: [JobsService, CompaniesService],
  exports: [JobsService, CompaniesService],
})
export class JobsModule {}
