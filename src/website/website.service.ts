import { Injectable } from '@nestjs/common';
import { AgentService } from '~/agent/agent.service';
import { ChannelService } from '~/channel/channel.service';
import { ChatService } from '~/chat/chat.service';
import { CustomerService } from '~/customer/customer.service';
import signJwt from '~/lib/jwt/sign';
import { InitiateWebsiteChatDto } from './dto/website-chat-initiate.dto';

@Injectable()
export class WebsiteService {
  constructor(
    private readonly channelService: ChannelService,
    private readonly customerService: CustomerService,
    private readonly agentService: AgentService,
    private readonly chatService: ChatService
  ) {}

  async initiateChat(
    clientId: string,
    fields: InitiateWebsiteChatDto,
    customerId?: string
  ) {
    const channel = await this.channelService.getByClientId(clientId, true);
    const customer = customerId
      ? await this.customerService.update(
          channel.appId.toString(),
          customerId,
          fields
        )
      : await this.customerService.create(
          channel.appId.toString(),
          channel._id.toString(),
          fields
        );

    const agent = await this.agentService.getAssignee(channel.appId.toString());

    const chat = await this.chatService.create(
      channel.appId.toString(),
      customer._id.toString(),
      {
        channelId: channel._id,
        assignee: agent
          ? {
              type: 'AGENT',
              assignedAt: new Date(),
              userId: agent.userId,
            }
          : null,
      }
    );

    const token = signJwt({
      type: 'CUSTOMER',
      customerId: customer._id.toString(),
      connectApp: {
        appId: customer.appId.toString(),
        channelId: customer.channelId.toString(),
      },
    });

    return { token, customer, chat };
  }
}
