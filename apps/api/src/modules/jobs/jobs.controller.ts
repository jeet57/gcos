import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CurrentUser, type CurrentUserPayload } from '../../common/decorators/current-user.decorator';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ListApplicationsQueryDto } from './dto/list-applications-query.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { JobsService } from './jobs.service';

/** Job application pipeline endpoints (M13). */
@ApiTags('jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get('stats')
  async getStats(@CurrentUser() user: CurrentUserPayload) {
    return this.jobsService.getStats(user.userId);
  }

  @Post()
  async create(@CurrentUser() user: CurrentUserPayload, @Body() dto: CreateApplicationDto) {
    return this.jobsService.create(user.userId, dto);
  }

  @Get()
  async list(@CurrentUser() user: CurrentUserPayload, @Query() query: ListApplicationsQueryDto) {
    return this.jobsService.list(user.userId, query);
  }

  @Get(':id')
  async findOne(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.jobsService.findOne(user.userId, id);
  }

  @Patch(':id')
  async update(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
    @Body() dto: UpdateApplicationDto,
  ) {
    return this.jobsService.update(user.userId, id, dto);
  }
}
