import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

/**
 * M07 scope: service stub only. All business logic is added when this
 * module is implemented. Composite dashboard query (implemented in M13)
 */
@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  stub(): { module: string; status: string } {
    return { module: 'dashboard', status: 'stub' };
  }
}
