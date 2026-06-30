import { Module } from '@nestjs/common';

import { PrismaModule } from '../../prisma/prisma.module';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';

/**
 * M07 scope: module stub only — registered in AppModule, no business
 * logic yet. Applications, companies, pipeline (implemented in M09-M10)
 */
@Module({
  imports: [PrismaModule],
  controllers: [JobsController],
  providers: [JobsService],
  exports: [JobsService],
})
export class JobsModule {}
