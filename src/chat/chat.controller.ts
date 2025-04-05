import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AgentGuard } from '~/agent/agent.guard';
import { GetSession } from '~/session/session.decorator';
import { ChatService } from './chat.service';

@UseGuards(AgentGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  async list(@GetSession('appId') appId: string) {
    const chats = await this.chatService.list(appId, {
      fetchCustomerInfo: true,
    });

    return {
      isSuccess: true,
      chats,
    };
  }

  @Get(':chatId')
  async messages(
    @GetSession('appId') appId: string,
    @Param('chatId') chatId: string
  ) {
    const { activities, chat } = await this.chatService.listMessage(
      appId,
      chatId
    );

    return {
      isSuccess: true,
      chat,
      activities,
    };
  }
}
