import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CurrentUser, type CurrentUserPayload } from '../../common/decorators/current-user.decorator';
import { CreateInterviewLogDto } from './dto/create-interview-log.dto';
import { CreateMockInterviewDto } from './dto/create-mock-interview.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { ListQuestionsQueryDto } from './dto/list-questions-query.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { InterviewsService } from './interviews.service';

@ApiTags('interviews')
@Controller('interviews')
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  @Get('questions/stats')
  async getStats(@CurrentUser() user: CurrentUserPayload) {
    return this.interviewsService.getStats(user.userId);
  }

  @Post('questions')
  async createQuestion(@CurrentUser() user: CurrentUserPayload, @Body() dto: CreateQuestionDto) {
    return this.interviewsService.createQuestion(user.userId, dto);
  }

  @Get('questions')
  async listQuestions(@CurrentUser() user: CurrentUserPayload, @Query() query: ListQuestionsQueryDto) {
    return this.interviewsService.listQuestions(user.userId, query);
  }

  @Patch('questions/:id')
  async updateQuestion(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
    @Body() dto: UpdateQuestionDto,
  ) {
    return this.interviewsService.updateQuestion(user.userId, id, dto);
  }

  @Post('logs')
  async createLog(@Body() dto: CreateInterviewLogDto) {
    return this.interviewsService.createInterviewLog(dto);
  }

  @Get('logs')
  async listLogs(@Query('applicationId') applicationId: string) {
    return this.interviewsService.listInterviewLogs(applicationId);
  }

  @Post('mock')
  async createMock(@CurrentUser() user: CurrentUserPayload, @Body() dto: CreateMockInterviewDto) {
    return this.interviewsService.createMockInterview(user.userId, dto);
  }

  @Get('mock')
  async listMocks(@CurrentUser() user: CurrentUserPayload) {
    return this.interviewsService.listMockInterviews(user.userId);
  }
}
