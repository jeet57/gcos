import { Body, Controller, Get, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CurrentUser, type CurrentUserPayload } from '../../common/decorators/current-user.decorator';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PortfolioService } from './portfolio.service';

/** Portfolio endpoints (M14) — both projects are seeded; only fields and milestone status are mutable. */
@ApiTags('portfolio')
@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get()
  async list(@CurrentUser() user: CurrentUserPayload) {
    return this.portfolioService.list(user.userId);
  }

  @Get(':id')
  async findOne(@CurrentUser() user: CurrentUserPayload, @Param('id', ParseIntPipe) id: number) {
    return this.portfolioService.findOne(user.userId, id);
  }

  @Patch(':id')
  async updateProject(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.portfolioService.updateProject(user.userId, id, dto);
  }

  @Patch(':id/milestones/:mid')
  async updateMilestone(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id', ParseIntPipe) id: number,
    @Param('mid', ParseIntPipe) mid: number,
    @Body() dto: UpdateMilestoneDto,
  ) {
    return this.portfolioService.updateMilestone(user.userId, id, mid, dto);
  }
}
