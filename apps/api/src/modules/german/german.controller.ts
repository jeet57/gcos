import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CurrentUser, type CurrentUserPayload } from '../../common/decorators/current-user.decorator';
import { CreateGermanSessionDto } from './dto/create-session.dto';
import { CreateVocabularyDto } from './dto/create-vocabulary.dto';
import { UpdateGermanUnitDto } from './dto/update-unit.dto';
import { GermanService } from './german.service';

@ApiTags('german')
@Controller('german')
export class GermanController {
  constructor(private readonly germanService: GermanService) {}

  @Get('stats')
  async getStats(@CurrentUser() user: CurrentUserPayload) {
    return this.germanService.getStats(user.userId);
  }

  @Post('sessions')
  async createSession(@CurrentUser() user: CurrentUserPayload, @Body() dto: CreateGermanSessionDto) {
    return this.germanService.createSession(user.userId, dto);
  }

  @Get('sessions')
  async listSessions(@CurrentUser() user: CurrentUserPayload) {
    return this.germanService.listSessions(user.userId);
  }

  @Get('units')
  async listUnits() {
    return this.germanService.listUnits();
  }

  @Patch('units/:id')
  async updateUnit(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateGermanUnitDto) {
    return this.germanService.updateUnit(id, dto);
  }

  @Post('vocabulary')
  async addVocabulary(@CurrentUser() user: CurrentUserPayload, @Body() dto: CreateVocabularyDto) {
    return this.germanService.addVocabulary(user.userId, dto);
  }

  @Get('vocabulary')
  async listVocabulary(@CurrentUser() user: CurrentUserPayload) {
    return this.germanService.listVocabulary(user.userId);
  }
}
