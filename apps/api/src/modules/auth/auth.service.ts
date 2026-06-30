import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

/**
 * M07 scope: service stub only. All business logic is added when this
 * module is implemented. JWT auth: login, register, refresh (implemented in M08)
 */
@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  stub(): { module: string; status: string } {
    return { module: 'auth', status: 'stub' };
  }
}
