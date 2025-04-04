import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ChatService } from '~/chat/chat.service';
import { SendMessageDto } from '~/chat/dto/chat-send-message.dto';
import { CustomerGuard } from '~/customer/customer.guard';
import { CustomerService } from '~/customer/customer.service';
import { GetSession } from '~/session/session.decorator';

@UseGuards(CustomerGuard)
@Controller('website')
export class WebsiteController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly chatService: ChatService
  ) {}

  @Get('list')
  async list(
    @GetSession('appId') appId: string,
    @GetSession('customerId') customerId: string
  ) {
    const customer = await this.customerService.getById(appId, customerId);
    const chats = await this.chatService.list(appId, {
      customerIds: [customerId],
    });

    return {
      isSuccess: true,
      customer: {
        ...customer.fields,
        _id: customer._id,
      },
      chats,
    };
  }

  @Get(':chatId/message')
  async listMessage(
    @GetSession('appId') appId: string,
    @GetSession('customerId') customerId: string,
    @Param('chatId') chatId: string
  ) {
    const { chat, activities } = await this.chatService.listMessage(
      appId,
      chatId,
      customerId
    );

    return {
      isSuccess: true,
      chat,
      activities,
    };
  }

  @Post(':chatId/message')
  async message(
    @GetSession('appId') appId: string,
    @GetSession('customerId') customerId: string,
    @Param('chatId') chatId: string,
    @Body() body: SendMessageDto
  ) {
    const activity = await this.chatService.createMessage(
      appId,
      chatId,
      {
        type: 'CUSTOMER',
        customerId: customerId,
      },
      body
    );

    return {
      isSuccess: true,
      activity,
    };
  }
}
