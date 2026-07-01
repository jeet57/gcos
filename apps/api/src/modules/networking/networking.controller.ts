import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CurrentUser, type CurrentUserPayload } from '../../common/decorators/current-user.decorator';
import { CreateCoffeeChatDto } from './dto/create-coffee-chat.dto';
import { CreateConnectionDto } from './dto/create-connection.dto';
import { CreateLinkedinPostDto } from './dto/create-linkedin-post.dto';
import { UpdateConnectionDto } from './dto/update-connection.dto';
import { NetworkingService } from './networking.service';

@ApiTags('networking')
@Controller('networking')
export class NetworkingController {
  constructor(private readonly networkingService: NetworkingService) {}

  @Get('stats')
  async getStats(@CurrentUser() user: CurrentUserPayload) {
    return this.networkingService.getStats(user.userId);
  }

  @Post('connections')
  async createConnection(@CurrentUser() user: CurrentUserPayload, @Body() dto: CreateConnectionDto) {
    return this.networkingService.createConnection(user.userId, dto);
  }

  @Get('connections')
  async listConnections(@CurrentUser() user: CurrentUserPayload) {
    return this.networkingService.listConnections(user.userId);
  }

  @Patch('connections/:id')
  async updateConnection(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
    @Body() dto: UpdateConnectionDto,
  ) {
    return this.networkingService.updateConnection(user.userId, id, dto);
  }

  @Post('connections/:id/coffee-chats')
  async createCoffeeChat(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
    @Body() dto: CreateCoffeeChatDto,
  ) {
    return this.networkingService.createCoffeeChat(user.userId, id, dto);
  }

  @Get('connections/:id/coffee-chats')
  async listCoffeeChats(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.networkingService.listCoffeeChats(user.userId, id);
  }

  @Post('posts')
  async createPost(@CurrentUser() user: CurrentUserPayload, @Body() dto: CreateLinkedinPostDto) {
    return this.networkingService.createPost(user.userId, dto);
  }

  @Get('posts')
  async listPosts(@CurrentUser() user: CurrentUserPayload) {
    return this.networkingService.listPosts(user.userId);
  }
}
