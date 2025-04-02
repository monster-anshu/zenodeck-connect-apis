import { Inject, Injectable } from '@nestjs/common';
import { Chat, ChatModelProvider } from '~/mongo/connect/chat.schema';

@Injectable()
export class ChatService {
  constructor(
    @Inject(ChatModelProvider.provide)
    private readonly chatModel: typeof ChatModelProvider.useValue
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
}
