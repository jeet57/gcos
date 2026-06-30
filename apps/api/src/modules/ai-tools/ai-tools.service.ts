import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

/**
 * M07 scope: service stub only. All business logic is added when this
 * module is implemented. Tool sessions log (implemented in M15)
 */
@Injectable()
export class AiToolsService {
  constructor(private readonly prisma: PrismaService) {}

  stub(): { module: string; status: string } {
    return { module: 'ai-tools', status: 'stub' };
  }
}
