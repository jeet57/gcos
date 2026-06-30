import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

/**
 * M07 scope: service stub only. All business logic is added when this
 * module is implemented. Score calculation service — core logic (implemented in M12)
 */
@Injectable()
export class ReadinessScoreService {
  constructor(private readonly prisma: PrismaService) {}

  stub(): { module: string; status: string } {
    return { module: 'readiness-score', status: 'stub' };
  }
}
