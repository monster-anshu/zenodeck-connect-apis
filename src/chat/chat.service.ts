import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { ActivityService } from '~/activity/activity.service';
import { From } from '~/mongo/connect/activity.schema';
import { Chat, ChatModelProvider } from '~/mongo/connect/chat.schema';
import { SendMessageDto } from './dto/chat-send-message.dto';

@Injectable()
export class ChatService {
  constructor(
    @Inject(ChatModelProvider.provide)
    private readonly chatModel: typeof ChatModelProvider.useValue,
    private readonly activityService: ActivityService
  ) {}

  async create(appId: string, customerId: string, data: Partial<Chat>) {
    const existingChat = await this.chatModel
      .findOne({
        status: 'ACTIVE',
        appId: appId,
        customerId: customerId,
      })
      .lean();

    if (existingChat) return existingChat;

    const chat = await this.chatModel.create({
      status: 'ACTIVE',
      ...data,
      appId: appId,
      customerId: customerId,
    });

    return chat.toObject();
  }

  async message(
    appId: string,
    channelId: string,
    chatId: string,
    from: From,
    body: SendMessageDto
  ) {
    const chat = await this.chatModel
      .findOne({
        _id: chatId,
        appId: appId,
        status: 'ACTIVE',
      })
      .lean();

    if (!chat) {
      throw new NotFoundException('CHAT_NOT_FOUND');
    }

    const activity = await this.activityService.create(appId, {
      channelId: new Types.ObjectId(channelId),
      chatId: chat._id,
      from: from,
      messageData: {
        message: body.message,
        type: body.type,
      },
      timestamp: new Date(),
      type: 'MESSAGE',
    });

    return activity;
  }
}
