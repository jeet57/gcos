import { Module } from '@nestjs/common';

import { PrismaModule } from '../../prisma/prisma.module';
import { ResumeController } from './resume.controller';
import { ResumeService } from './resume.service';

/**
 * M07 scope: module stub only — registered in AppModule, no business
 * logic yet. Versions, certifications (implemented in M15)
 */
@Module({
  imports: [PrismaModule],
  controllers: [ResumeController],
  providers: [ResumeService],
  exports: [ResumeService],
})
export class ResumeModule {}
