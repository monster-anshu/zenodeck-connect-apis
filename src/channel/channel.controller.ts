import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common';
import { AgentGuard } from '~/agent/agent.guard';
import { GetSession } from '~/session/session.decorator';
import { ChannelService } from './channel.service';

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
}
