import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { CurrentUser, type CurrentUserPayload } from '../../common/decorators/current-user.decorator';
import { CreateSessionDto } from './dto/create-session.dto';
import { ListSessionsQueryDto } from './dto/list-sessions-query.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { UpdateWeekDto } from './dto/update-week.dto';
import { StudyService } from './study.service';

/**
 * Study module endpoints (M11) — session logging, domain progress,
 * and the 12-month plan view. Every route here is behind the global
 * JwtAuthGuard (M07/M08).
 */
@ApiTags('study')
@Controller('study')
export class StudyController {
  constructor(private readonly studyService: StudyService) {}

  @Post('sessions')
  async createSession(@CurrentUser() user: CurrentUserPayload, @Body() dto: CreateSessionDto) {
    return this.studyService.createSession(user.userId, dto);
  }

  @Get('sessions')
  async listSessions(@CurrentUser() user: CurrentUserPayload, @Query() query: ListSessionsQueryDto) {
    return this.studyService.listSessions(user.userId, query);
  }

  @Get('domains')
  @ApiOkResponse({ description: 'All 11 study domains with this user weekly hours and completion %.' })
  async getDomains(@CurrentUser() user: CurrentUserPayload) {
    return this.studyService.getDomainProgress(user.userId);
  }

  @Get('plan')
  @ApiOkResponse({ description: '12 plan months with all weeks and this user completion state.' })
  async getPlan(@CurrentUser() user: CurrentUserPayload) {
    return this.studyService.getPlan(user.userId);
  }

  @Patch('weeks/:id')
  async updateWeek(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateWeekDto,
  ) {
    return this.studyService.updateWeek(user.userId, id, dto);
  }

  @Patch('topics/:id')
  async updateTopic(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTopicDto,
  ) {
    return this.studyService.updateTopic(user.userId, id, dto);
  }
}
