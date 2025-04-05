import { Controller, Get, UseGuards } from '@nestjs/common';
import { AgentGuard } from '~/agent/agent.guard';
import { GetSession } from '~/session/session.decorator';
import { ChatService } from './chat.service';

@UseGuards(AgentGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  async list(@GetSession('appId') appId: string) {
    const chats = await this.chatService.list(appId, {});

    return {
      isSuccess: true,
      chats,
    };
  }
}
