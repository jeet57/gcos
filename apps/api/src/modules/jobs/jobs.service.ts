import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

/**
 * M07 scope: service stub only. All business logic is added when this
 * module is implemented. Applications, companies, pipeline (implemented in M09-M10)
 */
@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) {}

  stub(): { module: string; status: string } {
    return { module: 'jobs', status: 'stub' };
  }
}
