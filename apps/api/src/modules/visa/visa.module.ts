import { Module } from '@nestjs/common';

import { PrismaModule } from '../../prisma/prisma.module';
import { VisaController } from './visa.controller';
import { VisaService } from './visa.service';

/**
 * M07 scope: module stub only — registered in AppModule, no business
 * logic yet. Document checklist (implemented in M15)
 */
@Module({
  imports: [PrismaModule],
  controllers: [VisaController],
  providers: [VisaService],
  exports: [VisaService],
})
export class VisaModule {}
