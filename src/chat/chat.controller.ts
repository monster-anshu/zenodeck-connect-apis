import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AgentGuard } from '~/agent/agent.guard';
import { GetSession } from '~/session/session.decorator';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/chat-send-message.dto';

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

  @Post(':chatId')
  async send(
    @GetSession('appId') appId: string,
    @GetSession('userId') userId: string,
    @Param('chatId') chatId: string,
    @Body() body: SendMessageDto
  ) {
    const activity = await this.chatService.createMessage(
      appId,
      chatId,
      {
        type: 'AGENT',
        userId: userId,
      },
      body
    );

    return {
      isSuccess: true,
      activity,
    };
  }
}
