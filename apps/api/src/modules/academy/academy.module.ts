import { Module } from '@nestjs/common';

import { PrismaModule } from '../../prisma/prisma.module';
import { AcademyController } from './academy.controller';
import { AcademyService } from './academy.service';

/**
 * M07 scope: module stub only — registered in AppModule, no business
 * logic yet. Lessons, quiz, progress (implemented in M11)
 */
@Module({
  imports: [PrismaModule],
  controllers: [AcademyController],
  providers: [AcademyService],
  exports: [AcademyService],
})
export class AcademyModule {}
