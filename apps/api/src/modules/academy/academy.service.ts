import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

/**
 * M07 scope: service stub only. All business logic is added when this
 * module is implemented. Lessons, quiz, progress (implemented in M11)
 */
@Injectable()
export class AcademyService {
  constructor(private readonly prisma: PrismaService) {}

  stub(): { module: string; status: string } {
    return { module: 'academy', status: 'stub' };
  }
}
