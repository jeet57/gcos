import { Module } from '@nestjs/common';

import { PrismaModule } from '../../prisma/prisma.module';
import { StudyController } from './study.controller';
import { StudyService } from './study.service';

/**
 * M07 scope: module stub only — registered in AppModule, no business
 * logic yet. Sessions, domains, plan weeks (implemented in M14)
 */
@Module({
  imports: [PrismaModule],
  controllers: [StudyController],
  providers: [StudyService],
  exports: [StudyService],
})
export class StudyModule {}
