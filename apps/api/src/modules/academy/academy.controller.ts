import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CurrentUser, type CurrentUserPayload } from '../../common/decorators/current-user.decorator';
import { AcademyService } from './academy.service';
import { AddToBankDto } from './dto/add-to-bank.dto';
import { SubmitQuizDto } from './dto/submit-quiz.dto';
import { UpdateNotesDto } from './dto/update-notes.dto';

/**
 * Academy module endpoints (M12) — modules, lessons, quiz engine,
 * progress, and interview-QA bank seeding from lesson content.
 */
@ApiTags('academy')
@Controller('academy')
export class AcademyController {
  constructor(private readonly academyService: AcademyService) {}

  @Get('modules')
  async listModules(@CurrentUser() user: CurrentUserPayload) {
    return this.academyService.listModules(user.userId);
  }

  @Get('progress')
  async getProgress(@CurrentUser() user: CurrentUserPayload) {
    return this.academyService.getProgress(user.userId);
  }

  @Get('next-lesson')
  async getNextLesson(@CurrentUser() user: CurrentUserPayload) {
    return this.academyService.getNextLesson(user.userId);
  }

  @Post('interview-qa/add-to-bank')
  async addToBank(@CurrentUser() user: CurrentUserPayload, @Body() dto: AddToBankDto) {
    return this.academyService.addToQuestionBank(user.userId, dto);
  }

  @Get('modules/:slug')
  async getModule(@CurrentUser() user: CurrentUserPayload, @Param('slug') slug: string) {
    return this.academyService.getModule(user.userId, slug);
  }

  @Get('lessons/:code')
  async getLesson(@CurrentUser() user: CurrentUserPayload, @Param('code') code: string) {
    return this.academyService.getLesson(user.userId, code);
  }

  @Post('lessons/:code/complete')
  async completeLesson(@CurrentUser() user: CurrentUserPayload, @Param('code') code: string) {
    return this.academyService.completeLesson(user.userId, code);
  }

  @Patch('lessons/:code/notes')
  async updateNotes(
    @CurrentUser() user: CurrentUserPayload,
    @Param('code') code: string,
    @Body() dto: UpdateNotesDto,
  ) {
    return this.academyService.updateNotes(user.userId, code, dto.personalNotes);
  }

  @Get('lessons/:code/quiz')
  async getQuiz(@Param('code') code: string) {
    return this.academyService.getQuiz(code);
  }

  @Post('lessons/:code/quiz')
  async submitQuiz(
    @CurrentUser() user: CurrentUserPayload,
    @Param('code') code: string,
    @Body() dto: SubmitQuizDto,
  ) {
    return this.academyService.submitQuiz(user.userId, code, dto);
  }

  @Get('lessons/:code/quiz/history')
  async getQuizHistory(@CurrentUser() user: CurrentUserPayload, @Param('code') code: string) {
    return this.academyService.getQuizHistory(user.userId, code);
  }
}
