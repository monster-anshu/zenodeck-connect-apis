import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AgentGuard } from '~/agent/agent.guard';
import { GetSession } from '~/session/session.decorator';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/channel-create.dto';

@UseGuards(AgentGuard)
@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Get()
  async list(@GetSession('appId') appId: string) {
    const channels = await this.channelService.list(appId);
    return {
      isSuccess: true,
      channels,
    };
  }

  @Get(':id')
  async get(@GetSession('appId') appId: string, @Param('id') id: string) {
    const channel = await this.channelService.getById(appId, id);
    return {
      isSuccess: true,
      channel,
    };
  }

  @Post()
  async create(
    @GetSession('appId') appId: string,
    @GetSession('userId') userId: string,
    @Body() body: CreateChannelDto
  ) {
    const channel = await this.channelService.create(appId, userId, body);
    return {
      isSuccess: true,
      channel,
    };
  }
}
