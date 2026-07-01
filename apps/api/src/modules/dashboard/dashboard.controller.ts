import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { CurrentUser, type CurrentUserPayload } from '../../common/decorators/current-user.decorator';
import { DashboardResponseDto } from './dto/dashboard-response.dto';
import { DashboardService } from './dashboard.service';

/**
 * GET /api/v1/dashboard (M10) — the composite Morning Check-In payload
 * (PRD v2 §8.5). Cached for 30s per-process via Nest's CacheInterceptor
 * (TAD §6 perf note); cache key is static since this is a single-user
 * app — multi-user cache key partitioning would be needed if GCOS ever
 * grows beyond Jitendra's own use.
 */
@ApiTags('dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheKey('dashboard')
  @CacheTTL(30_000)
  @ApiOkResponse({ type: DashboardResponseDto })
  async getDashboard(@CurrentUser() user: CurrentUserPayload): Promise<DashboardResponseDto> {
    return this.dashboardService.getDashboard(user.userId);
  }
}
