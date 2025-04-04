import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FilterQuery, PipelineStage, Types } from 'mongoose';
import { ActivityService } from '~/activity/activity.service';
import { From } from '~/mongo/connect/activity.schema';
import { AgentModelProvider } from '~/mongo/connect/agent.schema';
import { Chat, ChatModelProvider } from '~/mongo/connect/chat.schema';
import { CustomerModelProvider } from '~/mongo/connect/customer.schema';
import { SendMessageDto } from './dto/chat-send-message.dto';
import { ListChatFilter } from './type';

@Injectable()
export class ChatService {
  constructor(
    @Inject(ChatModelProvider.provide)
    private readonly chatModel: typeof ChatModelProvider.useValue,
    private readonly activityService: ActivityService
  ) {}

  async list(
    appId: string,
    { customerIds, fetchCustomerInfo, limit }: ListChatFilter
  ) {
    const filter: FilterQuery<Chat> = {
      appId: new Types.ObjectId(appId),
      status: 'ACTIVE',
    };

    if (customerIds?.length) {
      filter.customerId = {
        $in: customerIds.map((id) => new Types.ObjectId(id)),
      };
    }

    const pipelines: PipelineStage[] = [];

    pipelines.push({
      $match: filter,
    });

    pipelines.push({
      $lookup: {
        from: AgentModelProvider.useValue.collection.name,
        as: 'agent',
        localField: 'assignee.userId',
        foreignField: 'userId',
        let: { appId: '$appId' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$appId', '$$appId'] },
            },
          },
          {
            $project: {
              _id: 0,
              firstName: 1,
              lastName: 1,
              profilePic: 1,
              userId: 1,
            },
          },
        ],
      },
    });

    const addFields: PipelineStage.AddFields['$addFields'] = {
      'assignee.name': {
        $first: '$agent.firstName',
      },
      'assignee.profilePic': {
        $first: '$agent.profilePic',
      },
      // TODO: remove hard coded value
      'assignee.onlineStatus': 'ONLINE',
    };

    if (fetchCustomerInfo) {
      pipelines.push({
        $lookup: {
          from: CustomerModelProvider.useValue.collection.name,
          as: 'customer',
          localField: 'customerId',
          foreignField: '_id',
        },
      });

      addFields.customer = {
        $first: '$customer.fields',
      };
    }

    if (limit) {
      pipelines.push({
        $limit: limit,
      });
    }

    pipelines.push({ $addFields: addFields });

    const chats = await this.chatModel.aggregate(pipelines);

    return chats;
  }

  async create(appId: string, customerId: string, data: Partial<Chat>) {
    const existingChat = await this.chatModel
      .findOne({
        appId: appId,
        customerId: customerId,
        status: 'ACTIVE',
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

  async createMessage(
    appId: string,
    channelId: string,
    chatId: string,
    from: From,
    body: SendMessageDto
  ) {
    const filter: FilterQuery<Chat> = {
      _id: chatId,
      appId: appId,
      channelId: channelId,
      status: 'ACTIVE',
    };

    if (from.type === 'CUSTOMER') {
      filter.customerId = from.customerId;
    }

    const chat = await this.chatModel.findOne(filter).lean();

    if (!chat) {
      throw new NotFoundException('CHAT_NOT_FOUND');
    }

    const activity = await this.activityService.create(appId, {
      channelId: chat.channelId,
      chatId: chat._id,
      from: from,
      messageData: {
        message: body.message,
        type: body.type,
      },
      timestamp: new Date(),
      type: 'MESSAGE',
    });

    await this.chatModel.updateOne(
      {
        _id: chat._id,
      },
      {
        $inc: {
          totalMsgCount: 1,
        },
      }
    );

    return activity;
  }

  async listMessage(
    appId: string,
    channelId: string,
    chatId: string,
    customerId?: string
  ) {
    const filter: FilterQuery<Chat> = {
      _id: chatId,
      appId: appId,
      channelId: channelId,
      status: 'ACTIVE',
    };

    if (customerId) {
      filter.customerId = customerId;
    }

    const chat = await this.chatModel.findOne(filter).lean();

    if (!chat) {
      throw new NotFoundException('CHAT_NOT_FOUND');
    }

    const activities = await this.activityService.list(
      appId,
      chat._id.toString()
    );

    return activities;
  }
}
