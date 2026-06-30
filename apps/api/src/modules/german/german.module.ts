import { Module } from '@nestjs/common';

import { PrismaModule } from '../../prisma/prisma.module';
import { GermanController } from './german.controller';
import { GermanService } from './german.service';

/**
 * M07 scope: module stub only — registered in AppModule, no business
 * logic yet. Sessions, units, streak (implemented in M14)
 */
@Module({
  imports: [PrismaModule],
  controllers: [GermanController],
  providers: [GermanService],
  exports: [GermanService],
})
export class GermanModule {}
