import { Module } from '@nestjs/common';

import { PrismaModule } from '../../prisma/prisma.module';
import { NetworkingController } from './networking.controller';
import { NetworkingService } from './networking.service';

/**
 * M07 scope: module stub only — registered in AppModule, no business
 * logic yet. Connections, coffee chats (implemented in M15)
 */
@Module({
  imports: [PrismaModule],
  controllers: [NetworkingController],
  providers: [NetworkingService],
  exports: [NetworkingService],
})
export class NetworkingModule {}
