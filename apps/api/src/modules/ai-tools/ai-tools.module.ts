import { Module } from '@nestjs/common';

import { PrismaModule } from '../../prisma/prisma.module';
import { AiToolsController } from './ai-tools.controller';
import { AiToolsService } from './ai-tools.service';

/**
 * M07 scope: module stub only — registered in AppModule, no business
 * logic yet. Tool sessions log (implemented in M15)
 */
@Module({
  imports: [PrismaModule],
  controllers: [AiToolsController],
  providers: [AiToolsService],
  exports: [AiToolsService],
})
export class AiToolsModule {}
