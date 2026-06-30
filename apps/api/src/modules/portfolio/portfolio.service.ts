import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

/**
 * M07 scope: service stub only. All business logic is added when this
 * module is implemented. Projects, milestones (implemented in M15)
 */
@Injectable()
export class PortfolioService {
  constructor(private readonly prisma: PrismaService) {}

  stub(): { module: string; status: string } {
    return { module: 'portfolio', status: 'stub' };
  }
}
